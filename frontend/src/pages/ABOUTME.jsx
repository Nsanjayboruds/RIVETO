import React, { useEffect, useRef } from 'react';
import ProfileCard from '../components/ProfileCard';
import avatar from '../assets/avatar.jpg';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaDownload, FaCode, FaServer, FaDatabase, FaCloud, FaMobile } from 'react-icons/fa';
// import { SiJavascript, SiReact, SiNodedotjs, SiPython, SiMongodb, SiPostgresql, SiAmazonaws, SiDocker } from 'react-icons/si';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ABOUTME() {
  const sectionRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);

  useEffect(() => {
    // Animations
    gsap.fromTo(".aboutme-section",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );

    gsap.fromTo(skillsRef.current?.children,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: skillsRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  }, []);

//   const skills = {
//     frontend: [
//       { name: "JavaScript", icon: <SiJavascript className="text-yellow-400" />, level: 90 },
//       { name: "React", icon: <SiReact className="text-cyan-400" />, level: 95 },
//       { name: "HTML/CSS", icon: <FaCode className="text-orange-400" />, level: 92 },
//       { name: "Responsive Design", icon: <FaMobile className="text-pink-400" />, level: 88 }
//     ],
//     backend: [
//       { name: "Node.js", icon: <SiNodedotjs className="text-green-500" />, level: 90 },
//       { name: "Python", icon: <SiPython className="text-blue-400" />, level: 85 },
//       { name: "REST APIs", icon: <FaServer className="text-purple-400" />, level: 93 },
//       { name: "Microservices", icon: <FaCloud className="text-indigo-400" />, level: 87 }
//     ],
//     database: [
//       { name: "MongoDB", icon: <SiMongodb className="text-green-600" />, level: 88 },
//       { name: "PostgreSQL", icon: <SiPostgresql className="text-blue-600" />, level: 84 },
//       { name: "Database Design", icon: <FaDatabase className="text-amber-400" />, level: 89 }
//     ],
//     tools: [
//       { name: "AWS", icon: <SiAmazonaws className="text-orange-500" />, level: 82 },
//       { name: "Docker", icon: <SiDocker className="text-blue-400" />, level: 79 },
//       { name: "Git/GitHub", icon: <FaGithub className="text-gray-800" />, level: 94 }
//     ]
//   };

  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with React, Node.js, and MongoDB",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "https://github.com/NishantBorude/ecommerce-platform"
    },
    {
      title: "Task Management App",
      description: "Real-time collaborative task management application",
      tech: ["React", "Socket.io", "Express", "PostgreSQL"],
      link: "https://github.com/NishantBorude/task-manager"
    },
    {
      title: "Weather Dashboard",
      description: "Responsive weather application with forecasting features",
      tech: ["React", "OpenWeather API", "Chart.js"],
      link: "https://github.com/NishantBorude/weather-dashboard"
    }
  ];

  const socialLinks = [
    {
      icon: <FaGithub className="w-5 h-5" />,
      label: "GitHub",
      url: "https://github.com/NishantBorude",
      color: "hover:bg-gray-800"
    },
    {
      icon: <FaLinkedin className="w-5 h-5" />,
      label: "LinkedIn",
      url: "https://linkedin.com/in/nishantborude",
      color: "hover:bg-blue-600"
    },
    {
      icon: <FaTwitter className="w-5 h-5" />,
      label: "Twitter",
      url: "https://twitter.com/nishantborude",
      color: "hover:bg-blue-400"
    },
    {
      icon: <FaEnvelope className="w-5 h-5" />,
      label: "Email",
      url: "mailto:nishant.borude@example.com",
      color: "hover:bg-red-500"
    }
  ];

  return (
    <div ref={sectionRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0f172a] to-[#0c4a6e] py-20 px-4 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 aboutme-section">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Me</span>
          </h1>
          <p className="text-lg text-cyan-100 max-w-2xl mx-auto">
            Passionate Full Stack Developer with expertise in modern web technologies and a love for creating exceptional digital experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Profile Card */}
          <div className="lg:col-span-1 aboutme-section">
            <ProfileCard
              name="NISHANT BORUDE"
              title="FULL STACK DEVELOPER"
              handle="NishantBorude"
              status="Available for Opportunities"
              contactText="View Portfolio"
              avatarUrl={avatar}
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              onContactClick={() => window.open('https://github.com/NishantBorude', '_blank')}
              className="w-full"
            />
          </div>

          {/* About Text */}
          <div className="lg:col-span-2 aboutme-section">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 h-full">
              <h2 className="text-2xl font-bold text-white mb-6">Hello! I'm Nishant 👋</h2>
              
              <div className="space-y-4 text-gray-300">
                <p>
                  I'm a passionate Full Stack Developer with over 3 years of experience in creating 
                  innovative web applications. I specialize in JavaScript technologies, particularly 
                  React and Node.js, and I love turning complex problems into simple, beautiful solutions.
                </p>
                
                <p>
                  My journey in web development started during my computer science studies, and I've been 
                  hooked ever since. I enjoy every aspect of development - from designing intuitive user 
                  interfaces to building robust backend systems.
                </p>

                <p>
                  When I'm not coding, you can find me exploring new technologies, contributing to open 
                  source projects, or sharing knowledge with the developer community.
                </p>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Connect with me</h3>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color} text-white`}
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Resume Download */}
              <div className="mt-8">
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <FaDownload className="w-4 h-4" />
                  Download Resume
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div ref={skillsRef} className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Technical Skills</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Frontend Skills */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                <FaCode className="w-5 h-5" />
                Frontend Development
              </h3>
              <div className="space-y-4">
                {skills.frontend.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 flex items-center gap-2">
                        {skill.icon} {skill.name}
                      </span>
                      <span className="text-cyan-400 text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend Skills */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                <FaServer className="w-5 h-5" />
                Backend Development
              </h3>
              <div className="space-y-4">
                {skills.backend.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 flex items-center gap-2">
                        {skill.icon} {skill.name}
                      </span>
                      <span className="text-cyan-400 text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Database Skills */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                <FaDatabase className="w-5 h-5" />
                Database & Tools
              </h3>
              <div className="space-y-4">
                {skills.database.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 flex items-center gap-2">
                        {skill.icon} {skill.name}
                      </span>
                      <span className="text-cyan-400 text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools Skills */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                <FaCloud className="w-5 h-5" />
                DevOps & Cloud
              </h3>
              <div className="space-y-4">
                {skills.tools.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 flex items-center gap-2">
                        {skill.icon} {skill.name}
                      </span>
                      <span className="text-cyan-400 text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-amber-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div ref={projectsRef} className="aboutme-section">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Featured Projects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 hover:border-cyan-400/30 transition-all duration-500 hover:-translate-y-2">
                <h3 className="text-xl font-semibold text-white mb-3">{project.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="px-3 py-1 bg-cyan-500/10 text-cyan-300 text-xs rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-2"
                >
                  <FaGithub className="w-4 h-4" />
                  View on GitHub
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ABOUTME;