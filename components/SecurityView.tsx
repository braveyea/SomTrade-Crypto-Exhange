
import React, { useState } from 'react';

const Toggle: React.FC<{ label: string; enabled: boolean; onToggle: () => void; }> = ({ label, enabled, onToggle }) => (
    <label className="flex items-center justify-between cursor-pointer p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div>
            <span className="font-semibold text-gray-900 dark:text-white">{label}</span>
            <p className={`text-sm ${enabled ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>{enabled ? 'Enabled' : 'Disabled'}</p>
        </div>
        <div onClick={onToggle} className="relative">
            <input type="checkbox" checked={enabled} readOnly className="sr-only peer" />
            <div className="w-14 h-8 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
        </div>
    </label>
);


const SecurityView: React.FC = () => {
    const [tfaEnabled, setTfaEnabled] = useState(false);

    const mockLoginHistory = [
        { id: 1, date: '2024-07-21 10:30 AM', device: 'Chrome on MacOS', ip: '192.168.1.1', location: 'New York, USA', status: 'Success' },
        { id: 2, date: '2024-07-21 09:15 AM', device: 'Mobile App on iOS', ip: '10.0.0.5', location: 'New York, USA', status: 'Success' },
        { id: 3, date: '2024-07-20 05:00 PM', device: 'Firefox on Windows', ip: '8.8.8.8', location: 'Mountain View, USA', status: 'Failed' },
    ];
    
    return (
        <div className="max-w-screen-lg mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Security Center</h1>
                <p className="text-md text-gray-500 dark:text-gray-400 mt-2">Manage your account's security settings and activity.</p>
            </div>

            {/* Security Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Security Settings</h2>
                <div className="space-y-4">
                    <Toggle label="Two-Factor Authentication (2FA)" enabled={tfaEnabled} onToggle={() => setTfaEnabled(!tfaEnabled)} />
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center">
                         <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Password</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Last changed: 3 months ago</p>
                        </div>
                        <button className="font-semibold text-green-600 dark:text-green-400 hover:underline">Change</button>
                    </div>
                </div>
            </div>

            {/* Login History */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                 <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Login History</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Device</th>
                                <th className="px-4 py-3 hidden md:table-cell">IP Address</th>
                                <th className="px-4 py-3 hidden sm:table-cell">Location</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockLoginHistory.map(item => (
                                <tr key={item.id} className="border-b dark:border-gray-700">
                                    <td className="px-4 py-3">{item.date}</td>
                                    <td className="px-4 py-3">{item.device}</td>
                                    <td className="px-4 py-3 hidden md:table-cell">{item.ip}</td>
                                    <td className="px-4 py-3 hidden sm:table-cell">{item.location}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};

export default SecurityView;
