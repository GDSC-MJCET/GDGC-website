import React, { useState } from "react";
import Background from "../components/Background";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { IconMail, IconPhone, IconMapPin, IconClock, IconBrandInstagram, IconBrandLinkedin, IconBrandGithub, IconBrandYoutube } from "@tabler/icons-react";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Background bgColor="black">
      <Nav />
      <main className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-12">
            <h1
              className="text-4xl md:text-6xl font-bold mb-4"
              style={{
                background: "linear-gradient(to right, #f8d8d8, #cdf6c5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Get In Touch
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Have questions or want to collaborate? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Info Card */}
            <div
              className="p-8 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <h2 className="text-2xl font-semibold text-white mb-6">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-full"
                    style={{
                      background: "rgba(248,216,216,0.1)",
                      border: "1px solid rgba(248,216,216,0.2)",
                    }}
                  >
                    <IconMail size={20} color="#f8d8d8" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Email</p>
                    <p className="text-white">gdgc@mjcet.edu.in</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-full"
                    style={{
                      background: "rgba(205,246,197,0.1)",
                      border: "1px solid rgba(205,246,197,0.2)",
                    }}
                  >
                    <IconPhone size={20} color="#cdf6c5" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Phone</p>
                    <p className="text-white">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-full"
                    style={{
                      background: "rgba(248,216,216,0.1)",
                      border: "1px solid rgba(248,216,216,0.2)",
                    }}
                  >
                    <IconMapPin size={20} color="#f8d8d8" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Address</p>
                    <p className="text-white">MJ College of Engineering & Technology, Hyderabad</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-full"
                    style={{
                      background: "rgba(205,246,197,0.1)",
                      border: "1px solid rgba(205,246,197,0.2)",
                    }}
                  >
                    <IconClock size={20} color="#cdf6c5" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Office Hours</p>
                    <p className="text-white">Mon-Fri: 9AM-6PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-white/70 text-sm mb-4">
                  Follow us on social media for updates and announcements.
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/gdgc.mjcet/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full transition-all duration-200 hover:scale-110"
                    style={{
                      background: "rgba(248,216,216,0.1)",
                      border: "1px solid rgba(248,216,216,0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(248,216,216,0.2)";
                      e.currentTarget.style.borderColor = "rgba(248,216,216,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(248,216,216,0.1)";
                      e.currentTarget.style.borderColor = "rgba(248,216,216,0.2)";
                    }}
                  >
                    <IconBrandInstagram size={20} color="#f8d8d8" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/gdgmjcet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full transition-all duration-200 hover:scale-110"
                    style={{
                      background: "rgba(205,246,197,0.1)",
                      border: "1px solid rgba(205,246,197,0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(205,246,197,0.2)";
                      e.currentTarget.style.borderColor = "rgba(205,246,197,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(205,246,197,0.1)";
                      e.currentTarget.style.borderColor = "rgba(205,246,197,0.2)";
                    }}
                  >
                    <IconBrandLinkedin size={20} color="#cdf6c5" />
                  </a>
                  <a
                    href="https://github.com/GDSC-MJCET"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full transition-all duration-200 hover:scale-110"
                    style={{
                      background: "rgba(248,216,216,0.1)",
                      border: "1px solid rgba(248,216,216,0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(248,216,216,0.2)";
                      e.currentTarget.style.borderColor = "rgba(248,216,216,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(248,216,216,0.1)";
                      e.currentTarget.style.borderColor = "rgba(248,216,216,0.2)";
                    }}
                  >
                    <IconBrandGithub size={20} color="#f8d8d8" />
                  </a>
                  <a
                    href="https://www.youtube.com/@gdgcmjcet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full transition-all duration-200 hover:scale-110"
                    style={{
                      background: "rgba(205,246,197,0.1)",
                      border: "1px solid rgba(205,246,197,0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(205,246,197,0.2)";
                      e.currentTarget.style.borderColor = "rgba(205,246,197,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(205,246,197,0.1)";
                      e.currentTarget.style.borderColor = "rgba(205,246,197,0.2)";
                    }}
                  >
                    <IconBrandYoutube size={20} color="#cdf6c5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div
              className="p-8 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <h2 className="text-2xl font-semibold text-white mb-6">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors resize-none"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    background: "linear-gradient(to right, rgba(248,216,216,0.2), rgba(205,246,197,0.2))",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "white",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(to right, rgba(248,216,216,0.3), rgba(205,246,197,0.3))";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(to right, rgba(248,216,216,0.2), rgba(205,246,197,0.2))";
                  }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </Background>
  );
};

export default ContactUsPage;
