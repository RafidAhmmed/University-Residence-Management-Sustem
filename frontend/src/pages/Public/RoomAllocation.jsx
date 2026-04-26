import React, { useState } from 'react';
import {
  Bed, Users, Calendar, CheckCircle, FileText, Clock,
  MapPin, Phone, Mail, Info, Home, UserCheck
} from 'lucide-react';

const RoomAllocation = () => {
  const roomTypes = [
    { type: 'Double Room', icon: Users, capacity: 2, facilities: ['Shared bathroom', 'Study desks', 'Storage space', 'Wardrobes', 'WiFi', 'Fans'], price: '৳ 400/month', availability: 'Available' },
    { type: 'Quadraple Room', icon: Users, capacity: 4, facilities: ['Common bathroom', 'Study desks', 'Storage space', 'Wardrobes', 'WiFi', 'Fans'], price: '৳ 200/month', availability: 'Available' },
    { type: 'Gono Room', icon: Bed, capacity: 8, facilities: ['Common bathroom', 'Study desk', 'Wardrobe', 'WiFi', 'Fans'], price: '৳ 100/month', availability: 'Limited' }
  ];

  const halls = [
    { id: 'shahid-moushiur-rahman', name: 'Shahid Moushiur Rahman Hall', type: 'Boys', totalRooms: 80, availableRooms: 8, occupancy: '90%' },
    { id: 'munshi-meherullah', name: 'Munshi Meherullah Hall', type: 'Boys', totalRooms: 190, availableRooms: 32, occupancy: '83%' },
    { id: 'tapashi-rabeya', name: 'Tapashi Rabeya Hall', type: 'Girls', totalRooms: 70, availableRooms: 9, occupancy: '87%' },
    { id: 'bir-protik-taramon-bibi', name: 'Bir Protik Taramon Bibi Hall', type: 'Girls', totalRooms: 145, availableRooms: 22, occupancy: '85%' }
  ];

  const allocationSteps = [
    { step: 1, title: 'Online Application', description: 'Submit your room allocation application through the online portal with required documents.', icon: FileText, details: ['Student ID', 'Admission letter', 'Medical certificate', 'Guardian consent'] },
    { step: 2, title: 'Document Verification', description: 'Hall administration verifies all submitted documents and eligibility criteria.', icon: CheckCircle, details: ['Academic records', 'Financial status', 'Disciplinary record', 'Medical fitness'] },
    { step: 3, title: 'Room Assignment', description: 'Based on availability, merit, and preferences, rooms are allocated to eligible students.', icon: Home, details: ['Room type preference', 'Hall preference', 'Special requirements', 'Batch priority'] },
    { step: 4, title: 'Confirmation & Payment', description: 'Receive room allocation letter and complete the payment process to confirm your room.', icon: UserCheck, details: ['Allocation letter', 'Fee payment', 'Room key collection', 'Move-in date'] }
  ];

  const importantDates = [
    { event: '2025 Application Opens', date: 'November 25, 2025', status: 'Open' },
    { event: 'Application Deadline', date: 'December 15, 2025', status: 'Upcoming' },
    { event: 'Room Allocation Results', date: 'December 20, 2025', status: 'Upcoming' },
    { event: 'Move-in Period', date: 'January 1-5, 2026', status: 'Upcoming' }
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Banner */}
      <div className="page-banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-3">
            <Home size={36} className="mr-3 text-accent" />
            <h1 className="text-3xl sm:text-4xl font-bold font-heading">Room Allocation</h1>
          </div>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Secure your accommodation at Jashore University of Science and Technology
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 text-center border border-gray-100">
            <div className="text-2xl font-bold text-primary mb-1">{halls.reduce((s, h) => s + h.totalRooms, 0)}</div>
            <div className="text-gray-500 text-sm">Total Rooms</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 text-center border border-gray-100">
            <div className="text-2xl font-bold text-green-600 mb-1">{halls.reduce((s, h) => s + h.availableRooms, 0)}</div>
            <div className="text-gray-500 text-sm">Available Now</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 text-center border border-gray-100">
            <div className="text-2xl font-bold text-secondary mb-1">{Math.round(halls.reduce((s, h) => s + parseInt(h.occupancy), 0) / halls.length)}%</div>
            <div className="text-gray-500 text-sm">Avg. Occupancy</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 text-center border border-gray-100">
            <div className="text-2xl font-bold text-primary mb-1">3</div>
            <div className="text-gray-500 text-sm">Room Types</div>
          </div>
        </div>

        {/* Room Types */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary mb-2 font-heading">Room Types & Facilities</h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">Choose from our range of accommodation options</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {roomTypes.map((room, i) => {
              const Icon = room.icon;
              return (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 card-hover">
                  <div className="bg-primary text-white p-5">
                    <div className="flex items-center gap-3 mb-1">
                      <Icon size={20} />
                      <h3 className="text-lg font-bold font-heading">{room.type}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <Users size={14} />
                      <span>Capacity: {room.capacity} student{room.capacity > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="mb-4">
                      <h4 className="font-semibold text-primary text-sm mb-2">Facilities:</h4>
                      <ul className="space-y-1">
                        {room.facilities.map((f, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle size={13} className="text-secondary flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-secondary">{room.price}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          room.availability === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>{room.availability}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Availability Table */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary mb-2 font-heading">Current Availability</h2>
            <p className="text-gray-500 text-sm">Check room availability across all halls</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface">
                  <tr>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-primary">Hall Name</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-primary">Type</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-primary">Total Rooms</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-primary">Available</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-primary">Occupancy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {halls.map((hall) => (
                    <tr key={hall.id} className="hover:bg-surface/50">
                      <td className="px-5 py-3 text-sm font-medium text-primary">{hall.name}</td>
                      <td className="px-5 py-3 text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          hall.type === 'Boys' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                        }`}>{hall.type}</span>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600">{hall.totalRooms}</td>
                      <td className="px-5 py-3 text-sm text-green-600 font-medium">{hall.availableRooms}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{hall.occupancy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Allocation Process */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary mb-2 font-heading">Allocation Process</h2>
            <p className="text-gray-500 text-sm">Follow these steps to secure your room</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {allocationSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 card-hover">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={18} className="text-secondary" />
                        <h3 className="text-base font-bold text-primary font-heading">{step.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                      <ul className="space-y-1">
                        {step.details.map((d, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                            <CheckCircle size={12} className="text-secondary flex-shrink-0" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Important Dates */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary mb-2 font-heading">Important Dates</h2>
            <p className="text-gray-500 text-sm">Mark these dates for room allocation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {importantDates.map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 card-hover">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.status === 'Open' ? 'bg-green-100' : 'bg-accent/30'
                  }`}>
                    <Calendar size={18} className={item.status === 'Open' ? 'text-green-600' : 'text-secondary'} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary text-sm mb-0.5">{item.event}</h3>
                    <p className="text-secondary font-medium text-sm mb-1.5">{item.date}</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-accent/30 text-secondary'
                    }`}>{item.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-sm p-7 border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <Info size={20} className="text-secondary" />
              <h2 className="text-xl font-bold text-primary font-heading">Eligibility Criteria</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-primary text-sm mb-3">Academic Requirements:</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  {['Currently enrolled student', 'Minimum CGPA of 2.5', 'No disciplinary issues'].map((r, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-secondary flex-shrink-0" />{r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-primary text-sm mb-3">Other Requirements:</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  {['Medical fitness certificate', 'Guardian consent form', 'Financial clearance'].map((r, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-secondary flex-shrink-0" />{r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-xl text-white p-7 text-center">
          <h2 className="text-xl font-bold mb-3 font-heading">Need Help with Room Allocation?</h2>
          <p className="text-white/60 mb-5 max-w-2xl mx-auto text-sm">Our team is here to assist you with any questions</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div className="flex flex-col items-center">
              <Phone size={22} className="mb-2 text-accent" />
              <div className="font-semibold text-sm">Hall Office</div>
              <div className="text-white/65 text-sm">+880 421 714 221</div>
            </div>
            <div className="flex flex-col items-center">
              <Mail size={22} className="mb-2 text-accent" />
              <div className="font-semibold text-sm">Email</div>
              <div className="text-white/65 text-sm">hall.admin@just.edu.bd</div>
            </div>
            <div className="flex flex-col items-center">
              <MapPin size={22} className="mb-2 text-accent" />
              <div className="font-semibold text-sm">Location</div>
              <div className="text-white/65 text-sm">Hall Administration Building</div>
            </div>
          </div>
          <button className="bg-accent text-secondary px-7 py-2.5 rounded-lg font-semibold hover:bg-accent-dark transition-colors text-sm">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomAllocation;
