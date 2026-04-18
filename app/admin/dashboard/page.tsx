"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./dashboard.css";

interface Project {
  id: string;
  title: string;
  category: string;
  note: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  alt?: string;
}

interface ClientInquiry {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  services: string[];
  projectBrief: string;
  isRead: boolean;
  createdAt: number;
  adminReply?: string;
  replyDate?: number;
}

interface PortfolioData {
  heroTitle: string;
  heroDescription: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  projects: Project[];
  inquiries: ClientInquiry[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [data, setData] = useState<PortfolioData>({
    heroTitle: "Cinematic Video Editing That Makes Brands Feel Premium",
    heroDescription: "I help creators, brands, and businesses turn raw footage into polished visual stories...",
    aboutText: "I'm Hamza Teha, a video editor building work that feels cinematic...",
    contactEmail: "hamzatehafeko8@gmail.com",
    contactPhone: "+251 965614501",
    projects: [
      {
        id: "1",
        title: "Brand Story Edit",
        category: "Commercial / Identity",
        note: "Placeholder for result, reach, or audience impact.",
        type: "image",
        src: "/images/project-01.png",
        alt: "Project placeholder one",
      },
      {
        id: "2",
        title: "Social campaign Cut",
        category: "Short-Form / Social Media",
        note: "Space reserved for future metrics and campaign details.",
        type: "video",
        src: "/videos/project-02-placeholder.mp4",
        poster: "/images/project-02.png",
      },
      {
        id: "3",
        title: "YouTube Growth Edit",
        category: "Long-Form / Creator Content",
        note: "Ready for thumbnail, case outcome, and testimonial pairing later.",
        type: "image",
        src: "/images/project-03.png",
        alt: "Project placeholder three",
      },
    ],
    inquiries: [],
  });
  const [newProject, setNewProject] = useState<Partial<Project>>({
    type: "image",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (!auth) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
      const savedData = localStorage.getItem("portfolioData");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Ensure projects array exists
        if (!parsed.projects) {
          parsed.projects = [
            {
              id: "1",
              title: "Brand Story Edit",
              category: "Commercial / Identity",
              note: "Placeholder for result, reach, or audience impact.",
              type: "image",
              src: "/images/project-01.png",
              alt: "Project placeholder one",
            },
            {
              id: "2",
              title: "Social campaign Cut",
              category: "Short-Form / Social Media",
              note: "Space reserved for future metrics and campaign details.",
              type: "video",
              src: "/videos/project-02-placeholder.mp4",
              poster: "/images/project-02.png",
            },
            {
              id: "3",
              title: "YouTube Growth Edit",
              category: "Long-Form / Creator Content",
              note: "Ready for thumbnail, case outcome, and testimonial pairing later.",
              type: "image",
              src: "/images/project-03.png",
              alt: "Project placeholder three",
            },
          ];
        }
        // Ensure inquiries array exists
        if (!parsed.inquiries) {
          parsed.inquiries = [];
        }
        setData(parsed);
      }
    }
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleLogout() {
    localStorage.removeItem("adminAuth");
    router.push("/admin/login");
  }

  function handleInputChange(field: keyof PortfolioData, value: string) {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleAddProject() {
    if (!newProject.title || !newProject.category || !newProject.src) {
      alert("Please fill in all required fields");
      return;
    }
    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title,
      category: newProject.category,
      note: newProject.note || "",
      type: newProject.type as "image" | "video",
      src: newProject.src,
      poster: newProject.poster,
      alt: newProject.alt,
    };
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, project],
    }));
    setNewProject({ type: "image" });
  }

  function handleDeleteProject(id: string) {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  }

  function handleEditProject(project: Project) {
    setEditingId(project.id);
    setNewProject(project);
  }

  function handleUpdateProject() {
    if (!newProject.title || !newProject.category || !newProject.src) {
      alert("Please fill in all required fields");
      return;
    }
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === editingId
          ? {
              ...p,
              title: newProject.title!,
              category: newProject.category!,
              note: newProject.note || "",
              type: newProject.type as "image" | "video",
              src: newProject.src!,
              poster: newProject.poster,
              alt: newProject.alt,
            }
          : p
      ),
    }));
    setEditingId(null);
    setNewProject({ type: "image" });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setNewProject({ type: "image" });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, field: "src" | "poster") {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", field === "poster" ? "image" : newProject.type || "image");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setNewProject((prev) => ({
        ...prev,
        [field]: data.path,
      }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleSave() {
    // Auto-delete read inquiries older than 7 days
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const filteredInquiries = (data.inquiries || []).filter(
      (inquiry) => !inquiry.isRead || inquiry.createdAt > sevenDaysAgo
    );
    const updatedData = { ...data, inquiries: filteredInquiries };
    localStorage.setItem("portfolioData", JSON.stringify(updatedData));
    setData(updatedData);
    alert("Portfolio updated successfully!");
  }

  function handleMarkAsRead(inquiryId: string) {
    setData((prev) => ({
      ...prev,
      inquiries: prev.inquiries.map((inq) =>
        inq.id === inquiryId ? { ...inq, isRead: true } : inq
      ),
    }));
  }

  function handleMarkAsUnread(inquiryId: string) {
    setData((prev) => ({
      ...prev,
      inquiries: prev.inquiries.map((inq) =>
        inq.id === inquiryId ? { ...inq, isRead: false } : inq
      ),
    }));
  }

  function handleDeleteInquiry(inquiryId: string) {
    setData((prev) => ({
      ...prev,
      inquiries: prev.inquiries.filter((inq) => inq.id !== inquiryId),
    }));
  }

  async function handleSendReply(inquiryId: string, reply: string) {
    if (!reply.trim()) {
      alert("Please enter a reply message");
      return;
    }

    try {
      // Send email to client
      const inquiry = data.inquiries.find((inq) => inq.id === inquiryId);
      if (!inquiry) return;

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: inquiry.clientEmail,
          clientName: inquiry.clientName,
          message: reply,
          ownerEmail: data.contactEmail,
          ownerPhone: data.contactPhone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      // Update inquiry with reply
      setData((prev) => ({
        ...prev,
        inquiries: prev.inquiries.map((inq) =>
          inq.id === inquiryId
            ? { ...inq, adminReply: reply, replyDate: Date.now(), isRead: true }
            : inq
        ),
      }));

      alert("Reply sent successfully!");
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply. Please try again.");
    }
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <button
            className={`nav-btn ${activeTab === "hero" ? "active" : ""}`}
            onClick={() => setActiveTab("hero")}
          >
            Hero Section
          </button>
          <button
            className={`nav-btn ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
          <button
            className={`nav-btn ${activeTab === "contact" ? "active" : ""}`}
            onClick={() => setActiveTab("contact")}
          >
            Contact
          </button>
          <button
            className={`nav-btn ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            Projects
          </button>
          <button
            className={`nav-btn ${activeTab === "inquiries" ? "active" : ""}`}
            onClick={() => setActiveTab("inquiries")}
          >
            Inquiries ({data.inquiries?.filter((i) => !i.isRead).length || 0})
          </button>
        </nav>

        <div className="dashboard-panel">
          {activeTab === "hero" && (
            <div className="edit-section">
              <h2>Edit Hero Section</h2>
              <div className="form-group">
                <label>Hero Title</label>
                <input
                  type="text"
                  value={data.heroTitle}
                  onChange={(e) => handleInputChange("heroTitle", e.target.value)}
                  placeholder="Enter hero title"
                />
              </div>
              <div className="form-group">
                <label>Hero Description</label>
                <textarea
                  value={data.heroDescription}
                  onChange={(e) => handleInputChange("heroDescription", e.target.value)}
                  placeholder="Enter hero description"
                  rows={5}
                />
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="edit-section">
              <h2>Edit About Section</h2>
              <div className="form-group">
                <label>About Text</label>
                <textarea
                  value={data.aboutText}
                  onChange={(e) => handleInputChange("aboutText", e.target.value)}
                  placeholder="Enter about text"
                  rows={8}
                />
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="edit-section">
              <h2>Edit Contact Information</h2>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={data.contactEmail}
                  onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={data.contactPhone}
                  onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                  placeholder="Enter phone"
                />
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="edit-section">
              <h2>Manage Projects</h2>
              
              <div className="projects-form">
                <h3>{editingId ? "Edit Project" : "Add New Project"}</h3>
                <div className="form-group">
                  <label>Project Title *</label>
                  <input
                    type="text"
                    value={newProject.title || ""}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="e.g., Brand Story Edit"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    value={newProject.category || ""}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    placeholder="e.g., Commercial / Identity"
                  />
                </div>
                <div className="form-group">
                  <label>Project Note</label>
                  <textarea
                    value={newProject.note || ""}
                    onChange={(e) => setNewProject({ ...newProject, note: e.target.value })}
                    placeholder="Brief description or metrics"
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Media Type *</label>
                  <select
                    value={newProject.type || "image"}
                    onChange={(e) => setNewProject({ ...newProject, type: e.target.value as "image" | "video", src: "", poster: "" })}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                
                {newProject.type === "image" ? (
                  <div className="form-group">
                    <label>Upload Image *</label>
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "src")}
                        disabled={uploading}
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="file-upload-label">
                        {newProject.src ? "✓ Image uploaded" : "Click to upload image"}
                      </label>
                      {newProject.src && <p className="file-path">{newProject.src}</p>}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Upload Video *</label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleFileUpload(e, "src")}
                          disabled={uploading}
                          id="video-upload"
                        />
                        <label htmlFor="video-upload" className="file-upload-label">
                          {newProject.src ? "✓ Video uploaded" : "Click to upload video"}
                        </label>
                        {newProject.src && <p className="file-path">{newProject.src}</p>}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Upload Video Thumbnail *</label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "poster")}
                          disabled={uploading}
                          id="thumbnail-upload"
                        />
                        <label htmlFor="thumbnail-upload" className="file-upload-label">
                          {newProject.poster ? "✓ Thumbnail uploaded" : "Click to upload thumbnail"}
                        </label>
                        {newProject.poster && <p className="file-path">{newProject.poster}</p>}
                      </div>
                    </div>
                  </>
                )}
                <div className="form-actions">
                  <button
                    onClick={editingId ? handleUpdateProject : handleAddProject}
                    className="btn-primary"
                  >
                    {editingId ? "Update Project" : "Add Project"}
                  </button>
                  {editingId && (
                    <button onClick={handleCancelEdit} className="btn-secondary">
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="projects-list">
                <h3>Current Projects ({(data.projects || []).length})</h3>
                {(data.projects || []).length === 0 ? (
                  <p>No projects yet. Add one above.</p>
                ) : (
                  <div className="projects-grid">
                    {(data.projects || []).map((project) => (
                      <div key={project.id} className="project-item">
                        <div className="project-preview">
                          {project.type === "video" ? (
                            <video poster={project.poster} style={{ width: "100%", height: "150px", objectFit: "cover" }}>
                              <source src={project.src} type="video/mp4" />
                            </video>
                          ) : (
                            <img src={project.src} alt={project.alt} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                          )}
                        </div>
                        <div className="project-info">
                          <h4>{project.title}</h4>
                          <p className="category">{project.category}</p>
                          <p className="note">{project.note}</p>
                          <p className="type">{project.type === "video" ? "🎬 Video" : "🖼️ Image"}</p>
                        </div>
                        <div className="project-actions">
                          <button onClick={() => handleEditProject(project)} className="btn-edit">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteProject(project.id)} className="btn-delete">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "inquiries" && (
            <div className="edit-section">
              <h2>Client Inquiries</h2>
              {!data.inquiries || data.inquiries.length === 0 ? (
                <p>No inquiries yet.</p>
              ) : (
                <div className="inquiries-list">
                  {data.inquiries.map((inquiry) => (
                    <div key={inquiry.id} className={`inquiry-card ${inquiry.isRead ? "read" : "unread"}`}>
                      <div className="inquiry-header">
                        <div className="inquiry-title">
                          <h4>{inquiry.clientName}</h4>
                          <span className={`status-badge ${inquiry.isRead ? "read" : "unread"}`}>
                            {inquiry.isRead ? "✓ Read" : "● Unread"}
                          </span>
                        </div>
                        <div className="inquiry-date">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="inquiry-details">
                        <p><strong>Phone:</strong> {inquiry.clientPhone}</p>
                        <p><strong>Email:</strong> {inquiry.clientEmail}</p>
                        <p><strong>Services:</strong> {inquiry.services.join(", ")}</p>
                        <p><strong>Project Brief:</strong></p>
                        <p className="brief">{inquiry.projectBrief}</p>
                      </div>

                      {inquiry.adminReply && (
                        <div className="inquiry-reply">
                          <p><strong>Your Reply:</strong></p>
                          <p>{inquiry.adminReply}</p>
                          <small>Sent: {new Date(inquiry.replyDate || 0).toLocaleDateString()}</small>
                        </div>
                      )}

                      <div className="inquiry-actions">
                        {!inquiry.isRead && (
                          <button onClick={() => handleMarkAsRead(inquiry.id)} className="btn-mark-read">
                            Mark as Read
                          </button>
                        )}
                        {inquiry.isRead && (
                          <button onClick={() => handleMarkAsUnread(inquiry.id)} className="btn-mark-unread">
                            Mark as Unread
                          </button>
                        )}
                        <button onClick={() => handleDeleteInquiry(inquiry.id)} className="btn-delete">
                          Delete
                        </button>
                      </div>

                      {!inquiry.adminReply && (
                        <div className="inquiry-reply-form">
                          <textarea
                            id={`reply-${inquiry.id}`}
                            placeholder="Type your reply message here..."
                            rows={3}
                          />
                          <button
                            onClick={() => {
                              const textarea = document.getElementById(`reply-${inquiry.id}`) as HTMLTextAreaElement;
                              handleSendReply(inquiry.id, textarea.value);
                              textarea.value = "";
                            }}
                            className="btn-send-reply"
                          >
                            Send Reply & Email
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <button onClick={handleSave} className="save-btn">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
