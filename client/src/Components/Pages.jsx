import React from 'react'
import { FileText, Home, Mail, Info, ArrowRight, Wrench, Users } from 'lucide-react'

function Pages() {
  const quickLinks = [
    {
      icon: Home,
      title: 'Home',
      description: 'Return to our homepage and explore our services',
      link: '/'
    },
    {
      icon: Wrench,
      title: 'Services',
      description: 'Expert IT support for Australian businesses',
      link: '/services'
    },
    {
      icon: Info,
      title: 'About Us',
      description: 'Learn more about our team in Cambodia',
      link: '/aboutus'
    },
    {
      icon: Mail,
      title: 'Contact',
      description: 'Get in touch with our support team',
      link: '/contact'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Site Pages</h1>
          <p className="text-lg text-gray-600">Quick navigation to all sections of WV Support Services</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickLinks.map((item, index) => {
            const Icon = item.icon
            return (
              <a
                key={index}
                href={item.link}
                className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[#0f8abe] hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 bg-[#0f8abe]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0f8abe] transition-colors duration-300">
                    <Icon className="w-6 h-6 text-[#0f8abe] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#0f8abe] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {item.description}
                  </p>
                  <div className="flex items-center text-[#0f8abe] text-sm font-medium">
                    Visit page
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        {/* Additional Info Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#0f8abe]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-[#0f8abe]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">About WV Support Services</h2>
              <p className="text-gray-600 mb-4">
                Based in Siem Reap, Cambodia, we provide comprehensive IT support services including software troubleshooting, 
                connectivity solutions, and database management for Australian businesses.
              </p>
              <p className="text-gray-600 mb-6">
                Professional, reliable IT support tailored specifically for Australian clients, delivered by experienced 
                technicians based in Cambodia.
              </p>
              <a 
                href="/services"
                className="inline-flex items-center gap-2 bg-[#0f8abe] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#0d7199] transition-colors duration-300"
              >
                Explore Our Services
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pages