import React, { useState, useEffect } from 'react';
import { 
    Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, Thermometer, Eye,
    Sunrise, Sunset, Moon, AlertTriangle, MapPin, Navigation, Activity,
    Heart, Shirt, Bike, Plane, Leaf, Fish, Snowflake, Gauge, TrendingUp,
    TrendingDown, Clock, Calendar, ChevronRight, ChevronLeft, Loader2,
    Waves, Mountain, Umbrella, CloudLightning, CloudFog, Zap, Star
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from '@/api/base44Client';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';

const WEATHER_ICONS = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
    snowy: CloudSnow,
    windy: Wind,
    stormy: CloudLightning,
    foggy: CloudFog
};

export default function WeatherDashboard({ location = "New York" }) {
    const [loading, setLoading] = useState(true);
    const [weatherData, setWeatherData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchLocation, setSearchLocation] = useState(location);
    const [savedLocations, setSavedLocations] = useState(['New York', 'London', 'Tokyo']);
    const [unit, setUnit] = useState('celsius');

    useEffect(() => {
        fetchWeatherData(searchLocation);
    }, []);

    const fetchWeatherData = async (loc) => {
        setLoading(true);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate comprehensive realistic weather data for "${loc}" for today (December 1, 2024). Include:
1. Current conditions: temperature, feels_like, humidity, wind_speed, wind_direction, pressure, visibility, uv_index, aqi (air quality 0-500), condition (sunny/cloudy/rainy/snowy/windy/stormy/foggy)
2. Hourly forecast for next 24 hours (temperature, condition, precipitation_chance)
3. 7-day forecast (date, high, low, condition, precipitation_chance)
4. Sun/moon: sunrise, sunset, moonrise, moonset, moon_phase
5. Alerts: array of any weather warnings (type, severity, message)
6. Lifestyle tips: clothing, activity recommendations
7. Historical: average_temp for this date, record_high, record_low
8. Pollen count (low/medium/high), allergy_alert text
9. Marine data if coastal: tide_high, tide_low, water_temp, wave_height

Make data realistic for the location and current season.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        location: { type: "string" },
                        country: { type: "string" },
                        timezone: { type: "string" },
                        current: {
                            type: "object",
                            properties: {
                                temperature: { type: "number" },
                                feels_like: { type: "number" },
                                humidity: { type: "number" },
                                wind_speed: { type: "number" },
                                wind_direction: { type: "string" },
                                pressure: { type: "number" },
                                visibility: { type: "number" },
                                uv_index: { type: "number" },
                                aqi: { type: "number" },
                                condition: { type: "string" },
                                description: { type: "string" }
                            }
                        },
                        hourly: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    hour: { type: "string" },
                                    temperature: { type: "number" },
                                    condition: { type: "string" },
                                    precipitation_chance: { type: "number" }
                                }
                            }
                        },
                        daily: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    date: { type: "string" },
                                    day: { type: "string" },
                                    high: { type: "number" },
                                    low: { type: "number" },
                                    condition: { type: "string" },
                                    precipitation_chance: { type: "number" }
                                }
                            }
                        },
                        sun_moon: {
                            type: "object",
                            properties: {
                                sunrise: { type: "string" },
                                sunset: { type: "string" },
                                moonrise: { type: "string" },
                                moonset: { type: "string" },
                                moon_phase: { type: "string" },
                                daylight_hours: { type: "number" }
                            }
                        },
                        alerts: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    type: { type: "string" },
                                    severity: { type: "string" },
                                    message: { type: "string" }
                                }
                            }
                        },
                        lifestyle: {
                            type: "object",
                            properties: {
                                clothing: { type: "string" },
                                outdoor_activity: { type: "string" },
                                best_time_outdoor: { type: "string" },
                                travel_advisory: { type: "string" }
                            }
                        },
                        historical: {
                            type: "object",
                            properties: {
                                average_temp: { type: "number" },
                                record_high: { type: "number" },
                                record_low: { type: "number" },
                                record_high_year: { type: "number" },
                                record_low_year: { type: "number" }
                            }
                        },
                        health: {
                            type: "object",
                            properties: {
                                pollen_count: { type: "string" },
                                allergy_alert: { type: "string" },
                                aqi_category: { type: "string" },
                                aqi_recommendation: { type: "string" }
                            }
                        },
                        marine: {
                            type: "object",
                            properties: {
                                tide_high: { type: "string" },
                                tide_low: { type: "string" },
                                water_temp: { type: "number" },
                                wave_height: { type: "number" }
                            }
                        }
                    }
                }
            });
            setWeatherData(response);
        } catch (error) {
            console.error('Failed to fetch weather:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchLocation.trim()) {
            fetchWeatherData(searchLocation);
        }
    };

    const convertTemp = (temp) => {
        if (unit === 'fahrenheit') {
            return Math.round((temp * 9/5) + 32);
        }
        return Math.round(temp);
    };

    const tempUnit = unit === 'celsius' ? '°C' : '°F';

    const getWeatherIcon = (condition) => {
        const Icon = WEATHER_ICONS[condition?.toLowerCase()] || Sun;
        return Icon;
    };

    const getAQIColor = (aqi) => {
        if (aqi <= 50) return '#22C55E';
        if (aqi <= 100) return '#EAB308';
        if (aqi <= 150) return '#F97316';
        if (aqi <= 200) return '#EF4444';
        return '#7C3AED';
    };

    const getUVColor = (uv) => {
        if (uv <= 2) return '#22C55E';
        if (uv <= 5) return '#EAB308';
        if (uv <= 7) return '#F97316';
        if (uv <= 10) return '#EF4444';
        return '#7C3AED';
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
                <p className="text-gray-500">Loading weather data...</p>
            </div>
        );
    }

    const CurrentIcon = weatherData?.current?.condition ? getWeatherIcon(weatherData.current.condition) : Sun;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Sun },
        { id: 'hourly', label: 'Hourly', icon: Clock },
        { id: 'daily', label: '7-Day', icon: Calendar },
        { id: 'maps', label: 'Maps', icon: MapPin },
        { id: 'health', label: 'Health', icon: Heart },
        { id: 'lifestyle', label: 'Lifestyle', icon: Shirt },
    ];

    return (
        <div className="space-y-6">
            {/* Search & Location Bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            placeholder="Search location..."
                            className="pl-10"
                        />
                    </div>
                    <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                        <Navigation className="w-4 h-4 mr-2" /> Get Weather
                    </Button>
                    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                        <Button 
                            type="button"
                            variant={unit === 'celsius' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setUnit('celsius')}
                            className={unit === 'celsius' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                        >
                            °C
                        </Button>
                        <Button 
                            type="button"
                            variant={unit === 'fahrenheit' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setUnit('fahrenheit')}
                            className={unit === 'fahrenheit' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                        >
                            °F
                        </Button>
                    </div>
                </form>
                <div className="flex gap-2 mt-3 flex-wrap">
                    {savedLocations.map((loc, i) => (
                        <button
                            key={i}
                            onClick={() => { setSearchLocation(loc); fetchWeatherData(loc); }}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                searchLocation === loc 
                                    ? 'bg-amber-500 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {loc}
                        </button>
                    ))}
                </div>
            </div>

            {/* Alerts */}
            {weatherData?.alerts?.length > 0 && (
                <div className="space-y-2">
                    {weatherData.alerts.map((alert, i) => (
                        <div key={i} className={`rounded-xl p-4 flex items-start gap-3 ${
                            alert.severity === 'high' ? 'bg-red-50 border border-red-200' :
                            alert.severity === 'medium' ? 'bg-amber-50 border border-amber-200' :
                            'bg-blue-50 border border-blue-200'
                        }`}>
                            <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                                alert.severity === 'high' ? 'text-red-500' :
                                alert.severity === 'medium' ? 'text-amber-500' :
                                'text-blue-500'
                            }`} />
                            <div>
                                <p className="font-medium">{alert.type}</p>
                                <p className="text-sm text-gray-600">{alert.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Current Weather Hero */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-6 text-white">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-5 h-5" />
                            <span className="text-white/90">{weatherData?.location}, {weatherData?.country}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <CurrentIcon className="w-20 h-20 text-white/90" />
                            <div>
                                <p className="text-6xl font-bold">{convertTemp(weatherData?.current?.temperature || 0)}{tempUnit}</p>
                                <p className="text-white/80 capitalize">{weatherData?.current?.description}</p>
                            </div>
                        </div>
                        <p className="mt-2 text-white/80">Feels like {convertTemp(weatherData?.current?.feels_like || 0)}{tempUnit}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white/20 rounded-xl p-3 text-center">
                            <Droplets className="w-6 h-6 mx-auto mb-1" />
                            <p className="text-2xl font-bold">{weatherData?.current?.humidity}%</p>
                            <p className="text-xs text-white/70">Humidity</p>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3 text-center">
                            <Wind className="w-6 h-6 mx-auto mb-1" />
                            <p className="text-2xl font-bold">{weatherData?.current?.wind_speed}</p>
                            <p className="text-xs text-white/70">km/h {weatherData?.current?.wind_direction}</p>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3 text-center">
                            <Eye className="w-6 h-6 mx-auto mb-1" />
                            <p className="text-2xl font-bold">{weatherData?.current?.visibility}</p>
                            <p className="text-xs text-white/70">km Visibility</p>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3 text-center">
                            <Gauge className="w-6 h-6 mx-auto mb-1" />
                            <p className="text-2xl font-bold">{weatherData?.current?.pressure}</p>
                            <p className="text-xs text-white/70">hPa Pressure</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sun & Moon */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Sunrise className="w-5 h-5 text-amber-500" />
                        <span className="text-sm text-gray-600">Sunrise</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{weatherData?.sun_moon?.sunrise}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl p-4 border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Sunset className="w-5 h-5 text-orange-500" />
                        <span className="text-sm text-gray-600">Sunset</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{weatherData?.sun_moon?.sunset}</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Moon className="w-5 h-5 text-indigo-500" />
                        <span className="text-sm text-gray-600">Moon Phase</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{weatherData?.sun_moon?.moon_phase}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-gray-600">Daylight</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{weatherData?.sun_moon?.daylight_hours}h</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                            activeTab === tab.id 
                                ? 'bg-amber-500 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Temperature Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">Temperature Trend (24h)</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weatherData?.hourly?.slice(0, 12) || []}>
                                    <defs>
                                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="hour" tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                                        formatter={(value) => [`${convertTemp(value)}${tempUnit}`, 'Temperature']}
                                    />
                                    <Area type="monotone" dataKey="temperature" stroke="#F59E0B" strokeWidth={2} fill="url(#tempGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Precipitation Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">Precipitation Chance</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weatherData?.hourly?.slice(0, 12) || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="hour" tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} domain={[0, 100]} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                                        formatter={(value) => [`${value}%`, 'Precipitation']}
                                    />
                                    <Bar dataKey="precipitation_chance" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AQI & UV Cards */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">Air Quality Index</h3>
                        <div className="flex items-center gap-6">
                            <div className="w-32 h-32">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart 
                                        innerRadius="60%" 
                                        outerRadius="100%" 
                                        data={[{ value: weatherData?.current?.aqi || 0, fill: getAQIColor(weatherData?.current?.aqi) }]}
                                        startAngle={180}
                                        endAngle={0}
                                    >
                                        <RadialBar dataKey="value" cornerRadius={10} background={{ fill: '#E5E7EB' }} />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                            </div>
                            <div>
                                <p className="text-3xl font-bold" style={{ color: getAQIColor(weatherData?.current?.aqi) }}>
                                    {weatherData?.current?.aqi}
                                </p>
                                <p className="font-medium text-gray-700">{weatherData?.health?.aqi_category}</p>
                                <p className="text-sm text-gray-500 mt-1">{weatherData?.health?.aqi_recommendation}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">UV Index</h3>
                        <div className="flex items-center gap-6">
                            <div className="w-32 h-32">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart 
                                        innerRadius="60%" 
                                        outerRadius="100%" 
                                        data={[{ value: (weatherData?.current?.uv_index || 0) * 10, fill: getUVColor(weatherData?.current?.uv_index) }]}
                                        startAngle={180}
                                        endAngle={0}
                                    >
                                        <RadialBar dataKey="value" cornerRadius={10} background={{ fill: '#E5E7EB' }} />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                            </div>
                            <div>
                                <p className="text-3xl font-bold" style={{ color: getUVColor(weatherData?.current?.uv_index) }}>
                                    {weatherData?.current?.uv_index}
                                </p>
                                <p className="font-medium text-gray-700">
                                    {weatherData?.current?.uv_index <= 2 ? 'Low' :
                                     weatherData?.current?.uv_index <= 5 ? 'Moderate' :
                                     weatherData?.current?.uv_index <= 7 ? 'High' :
                                     weatherData?.current?.uv_index <= 10 ? 'Very High' : 'Extreme'}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {weatherData?.current?.uv_index <= 2 ? 'No protection needed' :
                                     weatherData?.current?.uv_index <= 5 ? 'Wear sunscreen' :
                                     'Seek shade, wear protection'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Historical Comparison */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
                        <h3 className="font-semibold text-gray-900 mb-4">Historical Comparison</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-500">Today</p>
                                <p className="text-2xl font-bold text-gray-900">{convertTemp(weatherData?.current?.temperature)}{tempUnit}</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-xl">
                                <p className="text-sm text-gray-500">Average</p>
                                <p className="text-2xl font-bold text-blue-600">{convertTemp(weatherData?.historical?.average_temp)}{tempUnit}</p>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-xl">
                                <p className="text-sm text-gray-500">Record High ({weatherData?.historical?.record_high_year})</p>
                                <p className="text-2xl font-bold text-red-600">{convertTemp(weatherData?.historical?.record_high)}{tempUnit}</p>
                            </div>
                            <div className="text-center p-4 bg-cyan-50 rounded-xl">
                                <p className="text-sm text-gray-500">Record Low ({weatherData?.historical?.record_low_year})</p>
                                <p className="text-2xl font-bold text-cyan-600">{convertTemp(weatherData?.historical?.record_low)}{tempUnit}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'hourly' && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Hourly Forecast</h3>
                    <div className="overflow-x-auto">
                        <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
                            {weatherData?.hourly?.map((hour, i) => {
                                const HourIcon = getWeatherIcon(hour.condition);
                                return (
                                    <div key={i} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl min-w-[80px]">
                                        <p className="text-sm text-gray-500">{hour.hour}</p>
                                        <HourIcon className="w-8 h-8 my-2 text-amber-500" />
                                        <p className="text-lg font-bold">{convertTemp(hour.temperature)}{tempUnit}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Droplets className="w-3 h-3 text-blue-500" />
                                            <span className="text-xs text-gray-500">{hour.precipitation_chance}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="mt-6 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weatherData?.hourly || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="hour" tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <YAxis yAxisId="temp" tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <YAxis yAxisId="precip" orientation="right" domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                                <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B' }} name="Temperature" />
                                <Line yAxisId="precip" type="monotone" dataKey="precipitation_chance" stroke="#3B82F6" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#3B82F6' }} name="Precipitation %" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {activeTab === 'daily' && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">7-Day Forecast</h3>
                    <div className="space-y-3">
                        {weatherData?.daily?.map((day, i) => {
                            const DayIcon = getWeatherIcon(day.condition);
                            return (
                                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="w-24">
                                        <p className="font-medium text-gray-900">{day.day}</p>
                                        <p className="text-sm text-gray-500">{day.date}</p>
                                    </div>
                                    <DayIcon className="w-10 h-10 text-amber-500" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-gray-900">{convertTemp(day.high)}{tempUnit}</span>
                                            <span className="text-gray-400">/</span>
                                            <span className="text-gray-500">{convertTemp(day.low)}{tempUnit}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 capitalize">{day.condition}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Droplets className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm text-gray-600">{day.precipitation_chance}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="mt-6 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weatherData?.daily || []}>
                                <defs>
                                    <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="lowGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                                <Area type="monotone" dataKey="high" stroke="#EF4444" strokeWidth={2} fill="url(#highGrad)" name="High" />
                                <Area type="monotone" dataKey="low" stroke="#3B82F6" strokeWidth={2} fill="url(#lowGrad)" name="Low" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {activeTab === 'maps' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CloudRain className="w-5 h-5 text-blue-500" />
                            Precipitation Radar
                        </h3>
                        <div className="h-64 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                            <div className="text-center">
                                <CloudRain className="w-16 h-16 text-blue-400 mx-auto mb-2" />
                                <p className="text-gray-600">Radar map would display here</p>
                                <p className="text-sm text-gray-400">Integration with weather API required</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Thermometer className="w-5 h-5 text-red-500" />
                            Temperature Map
                        </h3>
                        <div className="h-64 bg-gradient-to-br from-amber-100 to-red-100 rounded-xl flex items-center justify-center">
                            <div className="text-center">
                                <Thermometer className="w-16 h-16 text-red-400 mx-auto mb-2" />
                                <p className="text-gray-600">Temperature overlay</p>
                                <p className="text-sm text-gray-400">Shows regional temperature patterns</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Wind className="w-5 h-5 text-teal-500" />
                            Wind Patterns
                        </h3>
                        <div className="h-64 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center">
                            <div className="text-center">
                                <Wind className="w-16 h-16 text-teal-400 mx-auto mb-2" />
                                <p className="text-gray-600">Wind flow visualization</p>
                                <p className="text-sm text-gray-400">Animated wind streams</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Cloud className="w-5 h-5 text-gray-500" />
                            Satellite View
                        </h3>
                        <div className="h-64 bg-gradient-to-br from-gray-100 to-slate-200 rounded-xl flex items-center justify-center">
                            <div className="text-center">
                                <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">Cloud coverage satellite</p>
                                <p className="text-sm text-gray-400">Real-time satellite imagery</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'health' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Leaf className="w-5 h-5 text-green-500" />
                            Pollen & Allergies
                        </h3>
                        <div className={`p-4 rounded-xl mb-4 ${
                            weatherData?.health?.pollen_count === 'high' ? 'bg-red-50' :
                            weatherData?.health?.pollen_count === 'medium' ? 'bg-amber-50' :
                            'bg-green-50'
                        }`}>
                            <p className="font-medium text-gray-900 capitalize">
                                Pollen Level: {weatherData?.health?.pollen_count}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{weatherData?.health?.allergy_alert}</p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Tree Pollen</span>
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: '30%' }} />
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Grass Pollen</span>
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }} />
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Ragweed</span>
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500 rounded-full" style={{ width: '80%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-purple-500" />
                            Health Metrics
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Air Quality</span>
                                    <span className="font-bold" style={{ color: getAQIColor(weatherData?.current?.aqi) }}>
                                        {weatherData?.current?.aqi} - {weatherData?.health?.aqi_category}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{weatherData?.health?.aqi_recommendation}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">UV Exposure</span>
                                    <span className="font-bold" style={{ color: getUVColor(weatherData?.current?.uv_index) }}>
                                        {weatherData?.current?.uv_index} - {
                                            weatherData?.current?.uv_index <= 2 ? 'Low' :
                                            weatherData?.current?.uv_index <= 5 ? 'Moderate' :
                                            weatherData?.current?.uv_index <= 7 ? 'High' :
                                            'Very High'
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Pressure Trend</span>
                                    <span className="font-bold text-gray-900 flex items-center gap-1">
                                        {weatherData?.current?.pressure} hPa
                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Stable - good for outdoor activities</p>
                            </div>
                        </div>
                    </div>

                    {weatherData?.marine && (
                        <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Waves className="w-5 h-5 text-blue-500" />
                                Marine Conditions
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-blue-50 rounded-xl text-center">
                                    <Waves className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-gray-900">{weatherData.marine.wave_height}m</p>
                                    <p className="text-sm text-gray-500">Wave Height</p>
                                </div>
                                <div className="p-4 bg-cyan-50 rounded-xl text-center">
                                    <Thermometer className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-gray-900">{convertTemp(weatherData.marine.water_temp)}{tempUnit}</p>
                                    <p className="text-sm text-gray-500">Water Temp</p>
                                </div>
                                <div className="p-4 bg-teal-50 rounded-xl text-center">
                                    <TrendingUp className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-gray-900">{weatherData.marine.tide_high}</p>
                                    <p className="text-sm text-gray-500">High Tide</p>
                                </div>
                                <div className="p-4 bg-indigo-50 rounded-xl text-center">
                                    <TrendingDown className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-gray-900">{weatherData.marine.tide_low}</p>
                                    <p className="text-sm text-gray-500">Low Tide</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'lifestyle' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Shirt className="w-5 h-5 text-pink-500" />
                            What to Wear
                        </h3>
                        <div className="p-4 bg-pink-50 rounded-xl">
                            <p className="text-gray-700">{weatherData?.lifestyle?.clothing}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Bike className="w-5 h-5 text-green-500" />
                            Outdoor Activities
                        </h3>
                        <div className="p-4 bg-green-50 rounded-xl">
                            <p className="text-gray-700">{weatherData?.lifestyle?.outdoor_activity}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Best time: {weatherData?.lifestyle?.best_time_outdoor}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Plane className="w-5 h-5 text-blue-500" />
                            Travel Advisory
                        </h3>
                        <div className="p-4 bg-blue-50 rounded-xl">
                            <p className="text-gray-700">{weatherData?.lifestyle?.travel_advisory}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-500" />
                            Activity Ratings
                        </h3>
                        <div className="space-y-3">
                            {[
                                { activity: 'Running', rating: 4 },
                                { activity: 'Cycling', rating: 5 },
                                { activity: 'Hiking', rating: 4 },
                                { activity: 'Fishing', rating: 3 },
                                { activity: 'Photography', rating: 5 },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700">{item.activity}</span>
                                    <div className="flex gap-1">
                                        {[1,2,3,4,5].map(star => (
                                            <Star 
                                                key={star} 
                                                className={`w-4 h-4 ${star <= item.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}