import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Calendar, TrendingUp, Users, Target, Zap, Car, Home, Utensils, Award, Bell, Settings, User } from 'lucide-react';

const CarbonFootprintApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userProfile, setUserProfile] = useState({
    name: 'Nandana Renjith',
    monthlyBudget: 2000,
    location: 'Kollam, Kerala',
    goals: { monthly: 1500, yearly: 18000 }
  });

  // Simulated historical data
  const [historicalData, setHistoricalData] = useState([
    { month: 'Jan', actual: 1800, predicted: 1750, target: 1500 },
    { month: 'Feb', actual: 1650, predicted: 1600, target: 1500 },
    { month: 'Mar', actual: 1900, predicted: 1850, target: 1500 },
    { month: 'Apr', actual: 1750, predicted: 1700, target: 1500 },
    { month: 'May', actual: 1600, predicted: 1550, target: 1500 },
    { month: 'Jun', actual: 1850, predicted: 1800, target: 1500 },
    { month: 'Jul', actual: 2100, predicted: 2050, target: 1500 },
    { month: 'Aug', actual: 2200, predicted: 2150, target: 1500 },
    { month: 'Sep', actual: 1950, predicted: 1900, target: 1500 },
    { month: 'Oct', actual: 1800, predicted: 1750, target: 1500 },
    { month: 'Nov', actual: 1700, predicted: 1650, target: 1500 },
    { month: 'Dec', actual: 1600, predicted: 1550, target: 1500 }
  ]);

  // Forecasting with simulated ML predictions
  const [forecastData, setForecastData] = useState([
    { month: 'Jan 2025', predicted: 1450, confidence: 0.85 },
    { month: 'Feb 2025', predicted: 1380, confidence: 0.82 },
    { month: 'Mar 2025', predicted: 1420, confidence: 0.80 },
    { month: 'Apr 2025', predicted: 1350, confidence: 0.78 },
    { month: 'May 2025', predicted: 1300, confidence: 0.75 },
    { month: 'Jun 2025', predicted: 1400, confidence: 0.73 }
  ]);

  // Category breakdown
  const [categoryData, setCategoryData] = useState([
    { name: 'Transportation', value: 650, color: '#FF6B6B' },
    { name: 'Energy', value: 480, color: '#4ECDC4' },
    { name: 'Food', value: 320, color: '#45B7D1' },
    { name: 'Consumption', value: 250, color: '#96CEB4' },
    { name: 'Waste', value: 100, color: '#FFEAA7' }
  ]);

  // User activity tracking
  const [activities, setActivities] = useState([
    { date: '2024-12-15', type: 'transport', description: 'KSRTC bus to Trivandrum (45 km)', emissions: 8.5 },
    { date: '2024-12-15', type: 'energy', description: 'Home electricity usage', emissions: 12.2 },
    { date: '2024-12-14', type: 'food', description: 'Fish curry lunch', emissions: 3.8 },
    { date: '2024-12-14', type: 'transport', description: 'Auto-rickshaw to market', emissions: 2.1 }
  ]);

  // Community leaderboard
  const [leaderboard, setLeaderboard] = useState([
    { name: 'You', emissions: 1600, rank: 1, trend: 'down' },
    { name: 'Priya Menon', emissions: 1650, rank: 2, trend: 'down' },
    { name: 'Arjun Nair', emissions: 1720, rank: 3, trend: 'up' },
    { name: 'Kavya Krishnan', emissions: 1800, rank: 4, trend: 'down' },
    { name: 'Ravi Pillai', emissions: 1850, rank: 5, trend: 'up' }
  ]);

  // Recommendations using simulated ML
  const [recommendations, setRecommendations] = useState([
    { 
      title: 'Switch to Electric Vehicle',
      impact: 'Reduce 340 kg CO2/month',
      effort: 'High',
      category: 'Transportation',
      confidence: 0.92,
      details: 'Consider Tata Nexon EV or MG ZS EV available in Kerala'
    },
    {
      title: 'Install Solar Water Heater',
      impact: 'Reduce 85 kg CO2/month',
      effort: 'Medium',
      category: 'Energy',
      confidence: 0.88,
      details: 'Perfect for Kerala\'s sunny climate, ANERT subsidies available'
    },
    {
      title: 'Switch to Local Organic Food',
      impact: 'Reduce 45 kg CO2/month',
      effort: 'Low',
      category: 'Food',
      confidence: 0.85,
      details: 'Support local farmers and reduce transportation emissions'
    }
  ]);

  // Simple ML-like prediction function
  const predictNextMonth = (data) => {
    const recent = data.slice(-3);
    const trend = recent.reduce((acc, curr, idx) => {
      if (idx === 0) return acc;
      return acc + (curr.actual - recent[idx - 1].actual);
    }, 0) / 2;
    
    const base = recent[recent.length - 1].actual;
    const seasonalFactor = Math.sin((new Date().getMonth() + 1) * Math.PI / 6) * 50;
    
    return Math.max(800, base + trend * 0.7 + seasonalFactor);
  };

  const currentPrediction = useMemo(() => predictNextMonth(historicalData), [historicalData]);

  // Activity logger
  const [newActivity, setNewActivity] = useState({
    type: 'transport',
    description: '',
    value: ''
  });

  const addActivity = () => {
    if (newActivity.description && newActivity.value) {
      const emissionFactors = {
        transport: 0.5, // kg CO2 per mile
        energy: 0.7, // kg CO2 per kWh
        food: 2.5, // kg CO2 per serving
        waste: 0.3 // kg CO2 per kg waste
      };
      
      const emissions = parseFloat(newActivity.value) * emissionFactors[newActivity.type];
      
      setActivities(prev => [{
        date: new Date().toISOString().split('T')[0],
        type: newActivity.type,
        description: newActivity.description,
        emissions: Math.round(emissions * 10) / 10
      }, ...prev.slice(0, 9)]);
      
      setNewActivity({ type: 'transport', description: '', value: '' });
    }
  };

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EcoPredict</h1>
                <p className="text-sm text-gray-600">Carbon Footprint Forecasting</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                <p className="text-xs text-gray-500">{userProfile.location}</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="text-white" size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2 mb-6">
          <TabButton id="dashboard" label="Dashboard" icon={TrendingUp} active={activeTab === 'dashboard'} onClick={setActiveTab} />
          <TabButton id="forecast" label="Forecast" icon={Calendar} active={activeTab === 'forecast'} onClick={setActiveTab} />
          <TabButton id="track" label="Track" icon={Target} active={activeTab === 'track'} onClick={setActiveTab} />
          <TabButton id="community" label="Community" icon={Users} active={activeTab === 'community'} onClick={setActiveTab} />
          <TabButton id="insights" label="Insights" icon={Award} active={activeTab === 'insights'} onClick={setActiveTab} />
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">1,600 kg</p>
                    <p className="text-sm text-green-600">↓ 12% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-green-600" size={24} />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Next Month Prediction</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(currentPrediction)} kg</p>
                    <p className="text-sm text-blue-600">ML Confidence: 87%</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Goal</p>
                    <p className="text-2xl font-bold text-gray-900">1,500 kg</p>
                    <p className="text-sm text-orange-600">100 kg over target</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Target className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Community Rank</p>
                    <p className="text-2xl font-bold text-gray-900">#1</p>
                    <p className="text-sm text-green-600">Top 5% this month</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Award className="text-yellow-600" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Emissions Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#3B82F6" name="Actual" strokeWidth={2} />
                    <Line type="monotone" dataKey="predicted" stroke="#10B981" name="ML Prediction" strokeWidth={2} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="target" stroke="#EF4444" name="Target" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emissions by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'transport' ? 'bg-red-500' :
                        activity.type === 'energy' ? 'bg-blue-500' :
                        activity.type === 'food' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{activity.emissions} kg CO2</p>
                      <p className="text-xs text-gray-500 capitalize">{activity.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Forecast Tab */}
        {activeTab === 'forecast' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">6-Month Carbon Footprint Forecast</h3>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>AI Model:</strong> LSTM Neural Network with 87% accuracy
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Based on your historical data, seasonal patterns, and behavioral trends
                </p>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                    name="Predicted Emissions (kg CO2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast Confidence</h3>
                <div className="space-y-4">
                  {forecastData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${item.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario Analysis</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800">Best Case Scenario</h4>
                    <p className="text-sm text-green-700">Following all recommendations</p>
                    <p className="text-lg font-bold text-green-900">-25% reduction</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-800">Current Trajectory</h4>
                    <p className="text-sm text-yellow-700">Maintaining current habits</p>
                    <p className="text-lg font-bold text-yellow-900">-8% reduction</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-800">Worst Case Scenario</h4>
                    <p className="text-sm text-red-700">Increasing consumption patterns</p>
                    <p className="text-lg font-bold text-red-900">+15% increase</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Track Tab */}
        {activeTab === 'track' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Log New Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select 
                  value={newActivity.type}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, type: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="transport">Transportation</option>
                  <option value="energy">Energy</option>
                  <option value="food">Food</option>
                  <option value="waste">Waste</option>
                </select>
                <input
                  type="text"
                  placeholder="Description"
                  value={newActivity.description}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={newActivity.value}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, value: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={addActivity}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Activity
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity History</h3>
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.type === 'transport' ? 'bg-red-500' :
                        activity.type === 'energy' ? 'bg-blue-500' :
                        activity.type === 'food' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500">{activity.date} • {activity.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{activity.emissions} kg CO2</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Community Tab */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Leaderboard</h3>
              <div className="space-y-3">
                {leaderboard.map((user, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                    user.name === 'You' ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-700'
                      }`}>
                        {user.rank}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.emissions} kg CO2 this month</p>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${
                      user.trend === 'down' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {user.trend === 'down' ? '↓' : '↑'} {user.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Challenges</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-800">Reduce Transportation Emissions</h4>
                    <span className="text-sm text-green-600">7 days left</span>
                  </div>
                  <p className="text-sm text-green-700 mb-3">Goal: Reduce transport emissions by 20% this month</p>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }} />
                  </div>
                  <p className="text-xs text-green-600 mt-1">65% complete • 156 participants from Kerala</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-800">Energy Efficiency Week</h4>
                    <span className="text-sm text-blue-600">Starting soon</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">Goal: Optimize home energy usage</p>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }} />
                  </div>
                  <p className="text-xs text-blue-600 mt-1">0% complete • 98 participants from Kerala</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Recommendations</h3>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{rec.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        rec.effort === 'Low' ? 'bg-green-100 text-green-800' :
                        rec.effort === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {rec.effort} effort
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rec.impact}</p>
                    <p className="text-xs text-gray-500 mb-2">{rec.details}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Category: {rec.category}</span>
                      <span className="text-xs text-blue-600">
                        ML Confidence: {Math.round(rec.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Behavioral Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Monsoon Season Impact</h4>
                  <p className="text-sm text-purple-700">
                    Your emissions are lowest during monsoon months (-15% average due to reduced AC usage)
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2">Festival Season Trend</h4>
                  <p className="text-sm text-orange-700">
                    Emissions spike during Onam and Diwali periods (+25% due to travel and celebrations)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Analytics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Monthly Improvement</span>
                  <span className="text-sm font-bold text-green-600">-12.5%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Goal Achievement Rate</span>
                  <span className="text-sm font-bold text-blue-600">73%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Prediction Accuracy</span>
                  <span className="text-sm font-bold text-purple-600">87%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarbonFootprintApp;