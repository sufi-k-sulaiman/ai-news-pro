import React, { useState, useEffect } from 'react';
import { 
    Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, Thermometer, Eye,
    Sunrise, Sunset, Moon, AlertTriangle, MapPin, Navigation, Activity,
    Heart, Shirt, Bike, Plane, Leaf, Fish, Snowflake, Gauge, TrendingUp,
    TrendingDown, Clock, Calendar, ChevronRight, ChevronLeft, Loader2,
    Waves, Mountain, Umbrella, CloudLightning, CloudFog, Zap, Star,
    Home, Briefcase, Car, Anchor, TreePine, Camera, Award, Share2,
    ThermometerSun, ThermometerSnowflake, Compass, Radio, Wifi, Battery,
    Volume2, Settings, Bell, Filter, Globe, BarChart3, PieChart, LineChart
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from '@/api/base44Client';
import {
    LineChart as RechartsLine, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar,
    PieChart as RechartsPie, Pie, Cell, ComposedChart, Legend, ReferenceLine
} from 'recharts';

const WEATHER_ICONS = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
    snowy: CloudSnow,
    windy: Wind,
    stormy: CloudLightning,
    foggy: CloudFog,
    clear: Sun,
    'partly cloudy': Cloud
};

const CHART_COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export default function WeatherDashboard({ location = "New York" }) {
    const [loading, setLoading] = useState(true);
    const [weatherData, setWeatherData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchLocation, setSearchLocation] = useState(location);
    const [savedLocations, setSavedLocations] = useState(['New York', 'London', 'Tokyo', 'Sydney']);
    const [unit, setUnit] = useState('celsius');
    const [activeFilters, setActiveFilters] = useState({ interest: 'all', alerts: 'all' });
    const [userBadges, setUserBadges] = useState(['Early Bird', 'Weather Watcher']);
    const [streak, setStreak] = useState(7);

    useEffect(() => {
        fetchWeatherData(searchLocation);
    }, []);

    const fetchWeatherData = async (loc) => {
        setLoading(true);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate comprehensive realistic weather data for "${loc}" for today. Include ALL of the following:

1. Current conditions: temperature (realistic for location/season), feels_like, humidity, wind_speed, wind_direction, pressure, visibility, uv_index, aqi (0-500), condition (sunny/cloudy/rainy/snowy/windy/stormy/foggy), cloud_cover percentage, dew_point

2. Hourly forecast for next 24 hours: hour, temperature, condition, precipitation_chance, humidity, wind_speed, feels_like

3. 7-day forecast: date, day, high, low, condition, precipitation_chance, humidity, wind_speed, sunrise, sunset

4. 14-day extended forecast: date, day, high, low, condition, precipitation_chance (brief data)

5. Sun/moon data: sunrise, sunset, moonrise, moonset, moon_phase, moon_illumination percentage, daylight_hours, golden_hour_morning, golden_hour_evening

6. Weather alerts array: type, severity (low/medium/high), message, start_time, end_time

7. Lifestyle recommendations: clothing (detailed), outdoor_activity, best_time_outdoor, travel_advisory, gardening_tip, energy_tip

8. Historical comparison: average_temp, record_high, record_low, record_high_year, record_low_year, temp_departure (difference from average), last_year_temp

9. Health data: pollen_count (low/medium/high), pollen_types (tree/grass/ragweed levels), allergy_alert, aqi_category, aqi_recommendation, migraine_risk, asthma_risk

10. Marine data: tide_high_time, tide_low_time, water_temp, wave_height, current_strength, visibility_marine

11. Specialized data: 
    - ski_conditions: snow_depth, new_snow, slope_status, avalanche_risk
    - aviation: ceiling, visibility_aviation, wind_gust, turbulence_risk
    - fishing: fish_activity, best_fishing_time, water_clarity
    - farming: frost_risk, growing_conditions, irrigation_need, soil_temp

12. Climate insights: seasonal_comparison (vs last year), climate_trend, precipitation_ytd, precipitation_normal

13. Weather story: A 2-3 sentence narrative describing today's weather in an engaging way

Make all data realistic for the location, current season (December), and time.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        location: { type: "string" },
                        country: { type: "string" },
                        timezone: { type: "string" },
                        last_updated: { type: "string" },
                        current: {
                            type: "object",
                            properties: {
                                temperature: { type: "number" },
                                feels_like: { type: "number" },
                                humidity: { type: "number" },
                                wind_speed: { type: "number" },
                                wind_direction: { type: "string" },
                                wind_gust: { type: "number" },
                                pressure: { type: "number" },
                                visibility: { type: "number" },
                                uv_index: { type: "number" },
                                aqi: { type: "number" },
                                condition: { type: "string" },
                                description: { type: "string" },
                                cloud_cover: { type: "number" },
                                dew_point: { type: "number" }
                            }
                        },
                        hourly: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    hour: { type: "string" },
                                    temperature: { type: "number" },
                                    feels_like: { type: "number" },
                                    condition: { type: "string" },
                                    precipitation_chance: { type: "number" },
                                    humidity: { type: "number" },
                                    wind_speed: { type: "number" }
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
                                    precipitation_chance: { type: "number" },
                                    humidity: { type: "number" },
                                    wind_speed: { type: "number" },
                                    sunrise: { type: "string" },
                                    sunset: { type: "string" }
                                }
                            }
                        },
                        extended: {
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
                                moon_illumination: { type: "number" },
                                daylight_hours: { type: "number" },
                                golden_hour_morning: { type: "string" },
                                golden_hour_evening: { type: "string" }
                            }
                        },
                        alerts: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    type: { type: "string" },
                                    severity: { type: "string" },
                                    message: { type: "string" },
                                    start_time: { type: "string" },
                                    end_time: { type: "string" }
                                }
                            }
                        },
                        lifestyle: {
                            type: "object",
                            properties: {
                                clothing: { type: "string" },
                                outdoor_activity: { type: "string" },
                                best_time_outdoor: { type: "string" },
                                travel_advisory: { type: "string" },
                                gardening_tip: { type: "string" },
                                energy_tip: { type: "string" }
                            }
                        },
                        historical: {
                            type: "object",
                            properties: {
                                average_temp: { type: "number" },
                                record_high: { type: "number" },
                                record_low: { type: "number" },
                                record_high_year: { type: "number" },
                                record_low_year: { type: "number" },
                                temp_departure: { type: "number" },
                                last_year_temp: { type: "number" }
                            }
                        },
                        health: {
                            type: "object",
                            properties: {
                                pollen_count: { type: "string" },
                                pollen_tree: { type: "string" },
                                pollen_grass: { type: "string" },
                                pollen_ragweed: { type: "string" },
                                allergy_alert: { type: "string" },
                                aqi_category: { type: "string" },
                                aqi_recommendation: { type: "string" },
                                migraine_risk: { type: "string" },
                                asthma_risk: { type: "string" }
                            }
                        },
                        marine: {
                            type: "object",
                            properties: {
                                tide_high_time: { type: "string" },
                                tide_low_time: { type: "string" },
                                water_temp: { type: "number" },
                                wave_height: { type: "number" },
                                current_strength: { type: "string" },
                                visibility_marine: { type: "string" }
                            }
                        },
                        specialized: {
                            type: "object",
                            properties: {
                                ski: {
                                    type: "object",
                                    properties: {
                                        snow_depth: { type: "number" },
                                        new_snow: { type: "number" },
                                        slope_status: { type: "string" },
                                        avalanche_risk: { type: "string" }
                                    }
                                },
                                aviation: {
                                    type: "object",
                                    properties: {
                                        ceiling: { type: "number" },
                                        visibility: { type: "number" },
                                        wind_gust: { type: "number" },
                                        turbulence_risk: { type: "string" }
                                    }
                                },
                                fishing: {
                                    type: "object",
                                    properties: {
                                        fish_activity: { type: "string" },
                                        best_time: { type: "string" },
                                        water_clarity: { type: "string" }
                                    }
                                },
                                farming: {
                                    type: "object",
                                    properties: {
                                        frost_risk: { type: "string" },
                                        growing_conditions: { type: "string" },
                                        irrigation_need: { type: "string" },
                                        soil_temp: { type: "number" }
                                    }
                                }
                            }
                        },
                        climate: {
                            type: "object",
                            properties: {
                                seasonal_comparison: { type: "string" },
                                climate_trend: { type: "string" },
                                precipitation_ytd: { type: "number" },
                                precipitation_normal: { type: "number" }
                            }
                        },
                        weather_story: { type: "string" }
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

    const addLocation = () => {
        if (searchLocation.trim() && !savedLocations.includes(searchLocation)) {
            setSavedLocations([...savedLocations, searchLocation]);
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

    const getRiskColor = (risk) => {
        if (risk === 'low') return '#22C55E';
        if (risk === 'medium' || risk === 'moderate') return '#EAB308';
        if (risk === 'high') return '#EF4444';
        return '#6B7280';
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
                <p className="text-gray-500">Loading comprehensive weather data...</p>
            </div>
        );
    }

    const CurrentIcon = weatherData?.current?.condition ? getWeatherIcon(weatherData.current.condition) : Sun;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Sun },
        { id: 'hourly', label: 'Hourly', icon: Clock },
        { id: 'daily', label: '7-Day', icon: Calendar },
        { id: 'extended', label: '14-Day', icon: Calendar },
        { id: 'maps', label: 'Maps & Radar', icon: Globe },
        { id: 'health', label: 'Health', icon: Heart },
        { id: 'lifestyle', label: 'Lifestyle', icon: Shirt },
        { id: 'specialized', label: 'Specialized', icon: Anchor },
        { id: 'climate', label: 'Climate', icon: BarChart3 },
        { id: 'community', label: 'Community', icon: Share2 },
    ];

    // Prepare chart data
    const tempComparisonData = [
        { name: 'Today', value: weatherData?.current?.temperature || 0, fill: '#F59E0B' },
        { name: 'Average', value: weatherData?.historical?.average_temp || 0, fill: '#3B82F6' },
        { name: 'Last Year', value: weatherData?.historical?.last_year_temp || 0, fill: '#8B5CF6' },
    ];

    const precipitationComparisonData = [
        { name: 'YTD', value: weatherData?.climate?.precipitation_ytd || 0, fill: '#3B82F6' },
        { name: 'Normal', value: weatherData?.climate?.precipitation_normal || 0, fill: '#6B7280' },
    ];

    return (
        <div className="space-y-6">
            {/* Weather Story Banner */}
            {weatherData?.weather_story && (
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-5 text-white">
                    <div className="flex items-start gap-3">
                        <Volume2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold mb-1">Today's Weather Story</h3>
                            <p className="text-white/90">{weatherData.weather_story}</p>
                        </div>
                    </div>
                </div>
            )}

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
                    <Button type="button" variant="outline" onClick={addLocation}>
                        <Home className="w-4 h-4 mr-2" /> Save Location
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
                
                {/* Saved Locations */}
                <div className="flex gap-2 mt-3 flex-wrap">
                    {savedLocations.map((loc, i) => (
                        <button
                            key={i}
                            onClick={() => { setSearchLocation(loc); fetchWeatherData(loc); }}
                            className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-colors ${
                                searchLocation === loc 
                                    ? 'bg-amber-500 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {i === 0 ? <Home className="w-3 h-3" /> : 
                             i === 1 ? <Briefcase className="w-3 h-3" /> : 
                             <MapPin className="w-3 h-3" />}
                            {loc}
                        </button>
                    ))}
                </div>

                {/* Gamification - Streak & Badges */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium text-amber-700">{streak} Day Streak!</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {userBadges.map((badge, i) => (
                            <div key={i} className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-full">
                                <Award className="w-3 h-3 text-purple-500" />
                                <span className="text-xs text-purple-700">{badge}</span>
                            </div>
                        ))}
                    </div>
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
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium">{alert.type}</p>
                                    <span className="text-xs text-gray-500">{alert.start_time} - {alert.end_time}</span>
                                </div>
                                <p className="text-sm text-gray-600">{alert.message}</p>
                            </div>
                            <Button variant="ghost" size="sm"><Bell className="w-4 h-4" /></Button>
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
                            <span className="text-white/60 text-sm">• Updated {weatherData?.last_updated || 'just now'}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <CurrentIcon className="w-24 h-24 text-white/90" />
                            <div>
                                <p className="text-7xl font-bold">{convertTemp(weatherData?.current?.temperature || 0)}{tempUnit}</p>
                                <p className="text-white/80 capitalize text-lg">{weatherData?.current?.description}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-3 text-white/80">
                            <span className="flex items-center gap-1">
                                <ThermometerSun className="w-4 h-4" /> Feels {convertTemp(weatherData?.current?.feels_like || 0)}{tempUnit}
                            </span>
                            <span className="flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" /> H: {convertTemp(weatherData?.daily?.[0]?.high || 0)}{tempUnit}
                            </span>
                            <span className="flex items-center gap-1">
                                <TrendingDown className="w-4 h-4" /> L: {convertTemp(weatherData?.daily?.[0]?.low || 0)}{tempUnit}
                            </span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                            <Droplets className="w-6 h-6 mx-auto mb-1" />
                            <p className="text-2xl font-bold">{weatherData?.current?.humidity}%</p>
                            <p className="text-xs text-white/70">Humidity</p>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                            <Wind className="w-6 h-6 mx-auto mb-1" />
                            <p className="text-2xl font-bold">{weatherData?.current?.wind_speed}</p>
                            <p className="text-xs text-white/70">km/h {weatherData?.current?.wind_direction}</p>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                            <Eye className="w-6 h-6 mx-auto mb-1" />
                            <p className="text-2xl font-bold">{weatherData?.current?.visibility}</p>
                            <p className="text-xs text-white/70">km Visibility</p>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                            <Gauge className="w-6 h-6 mx-auto mb-1" />
                            <p className="text-2xl font-bold">{weatherData?.current?.pressure}</p>
                            <p className="text-xs text-white/70">hPa Pressure</p>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                            <Cloud className="w-6 h-6 mx-auto mb-1" />
                            <p className="text-2xl font-bold">{weatherData?.current?.cloud_cover}%</p>
                            <p className="text-xs text-white/70">Cloud Cover</p>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                            <Thermometer className="w-6 h-6 mx-auto mb-1" />
                            <p className="text-2xl font-bold">{convertTemp(weatherData?.current?.dew_point || 0)}{tempUnit}</p>
                            <p className="text-xs text-white/70">Dew Point</p>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                            <Sun className="w-6 h-6 mx-auto mb-1" />
                            <p className="text-2xl font-bold">{weatherData?.current?.uv_index}</p>
                            <p className="text-xs text-white/70">UV Index</p>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                            <Activity className="w-6 h-6 mx-auto mb-1" />
                            <p className="text-2xl font-bold">{weatherData?.current?.aqi}</p>
                            <p className="text-xs text-white/70">AQI</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sun & Moon Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
                    <p className="text-lg font-bold text-gray-900">{weatherData?.sun_moon?.moon_phase}</p>
                    <p className="text-xs text-gray-500">{weatherData?.sun_moon?.moon_illumination}% illuminated</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-gray-600">Daylight</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{weatherData?.sun_moon?.daylight_hours}h</p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Camera className="w-5 h-5 text-pink-500" />
                        <span className="text-sm text-gray-600">Golden Hour</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{weatherData?.sun_moon?.golden_hour_morning}</p>
                    <p className="text-sm text-gray-500">{weatherData?.sun_moon?.golden_hour_evening}</p>
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
                    {/* Temperature Trend Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <LineChart className="w-5 h-5 text-amber-500" />
                            24-Hour Temperature Trend
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={weatherData?.hourly?.slice(0, 12) || []}>
                                    <defs>
                                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="hour" tick={{ fill: '#6B7280', fontSize: 11 }} />
                                    <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                                        formatter={(value, name) => [
                                            name === 'temperature' ? `${convertTemp(value)}${tempUnit}` : `${convertTemp(value)}${tempUnit}`,
                                            name === 'temperature' ? 'Actual' : 'Feels Like'
                                        ]}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="temperature" stroke="#F59E0B" strokeWidth={2} fill="url(#tempGradient)" name="Temperature" />
                                    <Line type="monotone" dataKey="feels_like" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Feels Like" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Precipitation & Humidity Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CloudRain className="w-5 h-5 text-blue-500" />
                            Precipitation & Humidity
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={weatherData?.hourly?.slice(0, 12) || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="hour" tick={{ fill: '#6B7280', fontSize: 11 }} />
                                    <YAxis yAxisId="left" tick={{ fill: '#6B7280', fontSize: 11 }} domain={[0, 100]} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6B7280', fontSize: 11 }} domain={[0, 100]} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="precipitation_chance" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Precip %" />
                                    <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#10B981" strokeWidth={2} dot={false} name="Humidity %" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Wind Speed Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Wind className="w-5 h-5 text-teal-500" />
                            Wind Speed Forecast
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weatherData?.hourly?.slice(0, 12) || []}>
                                    <defs>
                                        <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="hour" tick={{ fill: '#6B7280', fontSize: 11 }} />
                                    <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} formatter={(value) => [`${value} km/h`, 'Wind Speed']} />
                                    <Area type="monotone" dataKey="wind_speed" stroke="#14B8A6" strokeWidth={2} fill="url(#windGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Temperature Comparison */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-purple-500" />
                            Temperature Comparison
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={tempComparisonData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 11 }} />
                                    <YAxis type="category" dataKey="name" tick={{ fill: '#6B7280', fontSize: 11 }} width={80} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} formatter={(value) => [`${convertTemp(value)}${tempUnit}`, 'Temperature']} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {tempComparisonData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium" style={{ color: weatherData?.historical?.temp_departure > 0 ? '#EF4444' : '#3B82F6' }}>
                                    {weatherData?.historical?.temp_departure > 0 ? '+' : ''}{weatherData?.historical?.temp_departure}°
                                </span>
                                {' '}from normal
                            </p>
                        </div>
                    </div>

                    {/* AQI Gauge */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-green-500" />
                            Air Quality Index
                        </h3>
                        <div className="flex items-center gap-6">
                            <div className="w-40 h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart 
                                        innerRadius="70%" 
                                        outerRadius="100%" 
                                        data={[{ value: Math.min(weatherData?.current?.aqi || 0, 100), fill: getAQIColor(weatherData?.current?.aqi) }]}
                                        startAngle={180}
                                        endAngle={0}
                                    >
                                        <RadialBar dataKey="value" cornerRadius={10} background={{ fill: '#E5E7EB' }} />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex-1">
                                <p className="text-4xl font-bold" style={{ color: getAQIColor(weatherData?.current?.aqi) }}>
                                    {weatherData?.current?.aqi}
                                </p>
                                <p className="font-medium text-gray-700 text-lg">{weatherData?.health?.aqi_category}</p>
                                <p className="text-sm text-gray-500 mt-2">{weatherData?.health?.aqi_recommendation}</p>
                            </div>
                        </div>
                    </div>

                    {/* UV Index Gauge */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Sun className="w-5 h-5 text-yellow-500" />
                            UV Index
                        </h3>
                        <div className="flex items-center gap-6">
                            <div className="w-40 h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart 
                                        innerRadius="70%" 
                                        outerRadius="100%" 
                                        data={[{ value: (weatherData?.current?.uv_index || 0) * 9, fill: getUVColor(weatherData?.current?.uv_index) }]}
                                        startAngle={180}
                                        endAngle={0}
                                    >
                                        <RadialBar dataKey="value" cornerRadius={10} background={{ fill: '#E5E7EB' }} />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex-1">
                                <p className="text-4xl font-bold" style={{ color: getUVColor(weatherData?.current?.uv_index) }}>
                                    {weatherData?.current?.uv_index}
                                </p>
                                <p className="font-medium text-gray-700 text-lg">
                                    {weatherData?.current?.uv_index <= 2 ? 'Low' :
                                     weatherData?.current?.uv_index <= 5 ? 'Moderate' :
                                     weatherData?.current?.uv_index <= 7 ? 'High' :
                                     weatherData?.current?.uv_index <= 10 ? 'Very High' : 'Extreme'}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    {weatherData?.current?.uv_index <= 2 ? 'No protection needed' :
                                     weatherData?.current?.uv_index <= 5 ? 'Wear sunscreen SPF 30+' :
                                     weatherData?.current?.uv_index <= 7 ? 'Reduce sun exposure 10am-4pm' :
                                     'Avoid being outside during midday'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Historical Records */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
                        <h3 className="font-semibold text-gray-900 mb-4">Historical Records for This Date</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="text-center p-4 bg-amber-50 rounded-xl">
                                <p className="text-sm text-gray-500">Today</p>
                                <p className="text-3xl font-bold text-amber-600">{convertTemp(weatherData?.current?.temperature)}{tempUnit}</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-xl">
                                <p className="text-sm text-gray-500">Historical Avg</p>
                                <p className="text-3xl font-bold text-blue-600">{convertTemp(weatherData?.historical?.average_temp)}{tempUnit}</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-xl">
                                <p className="text-sm text-gray-500">Last Year</p>
                                <p className="text-3xl font-bold text-purple-600">{convertTemp(weatherData?.historical?.last_year_temp)}{tempUnit}</p>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-xl">
                                <p className="text-sm text-gray-500">Record High ({weatherData?.historical?.record_high_year})</p>
                                <p className="text-3xl font-bold text-red-600">{convertTemp(weatherData?.historical?.record_high)}{tempUnit}</p>
                            </div>
                            <div className="text-center p-4 bg-cyan-50 rounded-xl">
                                <p className="text-sm text-gray-500">Record Low ({weatherData?.historical?.record_low_year})</p>
                                <p className="text-3xl font-bold text-cyan-600">{convertTemp(weatherData?.historical?.record_low)}{tempUnit}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'hourly' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">Hourly Forecast</h3>
                        <div className="overflow-x-auto">
                            <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
                                {weatherData?.hourly?.map((hour, i) => {
                                    const HourIcon = getWeatherIcon(hour.condition);
                                    return (
                                        <div key={i} className={`flex flex-col items-center p-4 rounded-xl min-w-[90px] ${i === 0 ? 'bg-amber-100 ring-2 ring-amber-500' : 'bg-gray-50'}`}>
                                            <p className="text-sm font-medium text-gray-600">{hour.hour}</p>
                                            <HourIcon className="w-10 h-10 my-2 text-amber-500" />
                                            <p className="text-xl font-bold">{convertTemp(hour.temperature)}{tempUnit}</p>
                                            <p className="text-xs text-gray-500">Feels {convertTemp(hour.feels_like)}{tempUnit}</p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <Droplets className="w-3 h-3 text-blue-500" />
                                                <span className="text-xs text-gray-500">{hour.precipitation_chance}%</span>
                                            </div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Wind className="w-3 h-3 text-teal-500" />
                                                <span className="text-xs text-gray-500">{hour.wind_speed} km/h</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">Detailed Hourly Charts</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={weatherData?.hourly || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="hour" tick={{ fill: '#6B7280', fontSize: 10 }} />
                                    <YAxis yAxisId="temp" tick={{ fill: '#6B7280', fontSize: 10 }} />
                                    <YAxis yAxisId="precip" orientation="right" domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 10 }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                                    <Legend />
                                    <Area yAxisId="temp" type="monotone" dataKey="temperature" stroke="#F59E0B" strokeWidth={2} fill="rgba(245, 158, 11, 0.1)" name="Temperature" />
                                    <Line yAxisId="temp" type="monotone" dataKey="feels_like" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Feels Like" />
                                    <Bar yAxisId="precip" dataKey="precipitation_chance" fill="#3B82F6" opacity={0.6} name="Precip %" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'daily' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">7-Day Forecast</h3>
                        <div className="space-y-3">
                            {weatherData?.daily?.map((day, i) => {
                                const DayIcon = getWeatherIcon(day.condition);
                                return (
                                    <div key={i} className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${i === 0 ? 'bg-amber-50 ring-1 ring-amber-200' : 'bg-gray-50 hover:bg-gray-100'}`}>
                                        <div className="w-28">
                                            <p className="font-medium text-gray-900">{i === 0 ? 'Today' : day.day}</p>
                                            <p className="text-sm text-gray-500">{day.date}</p>
                                        </div>
                                        <DayIcon className="w-12 h-12 text-amber-500" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl font-bold text-gray-900">{convertTemp(day.high)}{tempUnit}</span>
                                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-blue-400 via-amber-400 to-red-400 rounded-full"
                                                        style={{ width: '100%' }}
                                                    />
                                                </div>
                                                <span className="text-gray-500">{convertTemp(day.low)}{tempUnit}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 capitalize mt-1">{day.condition}</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Droplets className="w-4 h-4 text-blue-500" />
                                                <span className="text-gray-600">{day.precipitation_chance}%</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Wind className="w-4 h-4 text-teal-500" />
                                                <span className="text-gray-600">{day.wind_speed} km/h</span>
                                            </div>
                                            <div className="hidden md:flex items-center gap-1">
                                                <Sunrise className="w-4 h-4 text-amber-500" />
                                                <span className="text-gray-600">{day.sunrise}</span>
                                            </div>
                                            <div className="hidden md:flex items-center gap-1">
                                                <Sunset className="w-4 h-4 text-orange-500" />
                                                <span className="text-gray-600">{day.sunset}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">7-Day Temperature Range</h3>
                        <div className="h-72">
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
                                    <Legend />
                                    <Area type="monotone" dataKey="high" stroke="#EF4444" strokeWidth={2} fill="url(#highGrad)" name="High" />
                                    <Area type="monotone" dataKey="low" stroke="#3B82F6" strokeWidth={2} fill="url(#lowGrad)" name="Low" />
                                    <ReferenceLine y={weatherData?.historical?.average_temp} stroke="#8B5CF6" strokeDasharray="5 5" label={{ value: 'Avg', fill: '#8B5CF6', fontSize: 10 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'extended' && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">14-Day Extended Forecast</h3>
                    <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                        {weatherData?.extended?.map((day, i) => {
                            const DayIcon = getWeatherIcon(day.condition);
                            return (
                                <div key={i} className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <p className="font-medium text-gray-900 text-sm">{day.day}</p>
                                    <p className="text-xs text-gray-500 mb-2">{day.date}</p>
                                    <DayIcon className="w-10 h-10 mx-auto text-amber-500" />
                                    <div className="mt-2">
                                        <span className="font-bold text-gray-900">{convertTemp(day.high)}</span>
                                        <span className="text-gray-400 mx-1">/</span>
                                        <span className="text-gray-500">{convertTemp(day.low)}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-1 mt-1">
                                        <Droplets className="w-3 h-3 text-blue-500" />
                                        <span className="text-xs text-gray-500">{day.precipitation_chance}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'maps' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { title: 'Precipitation Radar', icon: CloudRain, color: 'blue', desc: 'Real-time precipitation tracking' },
                        { title: 'Temperature Map', icon: Thermometer, color: 'red', desc: 'Regional temperature patterns' },
                        { title: 'Wind Patterns', icon: Wind, color: 'teal', desc: 'Animated wind flow visualization' },
                        { title: 'Cloud Cover Satellite', icon: Cloud, color: 'gray', desc: 'Live satellite cloud imagery' },
                        { title: 'Pressure Systems', icon: Gauge, color: 'purple', desc: 'High and low pressure fronts' },
                        { title: 'Lightning Tracker', icon: Zap, color: 'yellow', desc: 'Real-time lightning strikes' },
                    ].map((map, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <map.icon className={`w-5 h-5 text-${map.color}-500`} />
                                {map.title}
                            </h3>
                            <div className={`h-48 bg-gradient-to-br from-${map.color}-100 to-${map.color}-200 rounded-xl flex items-center justify-center`}>
                                <div className="text-center">
                                    <map.icon className={`w-16 h-16 text-${map.color}-400 mx-auto mb-2`} />
                                    <p className="text-gray-600">{map.desc}</p>
                                    <Button variant="outline" size="sm" className="mt-3">
                                        <Globe className="w-4 h-4 mr-2" /> Open Map
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'health' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pollen Levels */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Leaf className="w-5 h-5 text-green-500" />
                            Pollen & Allergies
                        </h3>
                        <div className={`p-4 rounded-xl mb-4 ${
                            weatherData?.health?.pollen_count === 'high' ? 'bg-red-50 border border-red-200' :
                            weatherData?.health?.pollen_count === 'medium' ? 'bg-amber-50 border border-amber-200' :
                            'bg-green-50 border border-green-200'
                        }`}>
                            <p className="font-medium text-gray-900 capitalize">
                                Overall Pollen: {weatherData?.health?.pollen_count}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{weatherData?.health?.allergy_alert}</p>
                        </div>
                        <div className="space-y-3">
                            {[
                                { type: 'Tree Pollen', level: weatherData?.health?.pollen_tree },
                                { type: 'Grass Pollen', level: weatherData?.health?.pollen_grass },
                                { type: 'Ragweed', level: weatherData?.health?.pollen_ragweed },
                            ].map((pollen, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">{pollen.type}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full" 
                                                style={{ 
                                                    width: pollen.level === 'high' ? '100%' : pollen.level === 'medium' ? '60%' : '30%',
                                                    backgroundColor: getRiskColor(pollen.level)
                                                }} 
                                            />
                                        </div>
                                        <span className="text-sm font-medium capitalize" style={{ color: getRiskColor(pollen.level) }}>{pollen.level}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Health Risks */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-500" />
                            Health Risk Assessment
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Migraine Risk', value: weatherData?.health?.migraine_risk, icon: Activity },
                                { name: 'Asthma Risk', value: weatherData?.health?.asthma_risk, icon: Wind },
                                { name: 'Air Quality', value: weatherData?.health?.aqi_category, icon: Cloud },
                            ].map((risk, i) => (
                                <div key={i} className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <risk.icon className="w-5 h-5 text-gray-500" />
                                            <span className="text-gray-700">{risk.name}</span>
                                        </div>
                                        <span className="font-bold capitalize" style={{ color: getRiskColor(risk.value?.toLowerCase()) }}>
                                            {risk.value}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                            <p className="text-sm text-blue-700">{weatherData?.health?.aqi_recommendation}</p>
                        </div>
                    </div>

                    {/* Marine Conditions */}
                    {weatherData?.marine && (
                        <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Waves className="w-5 h-5 text-blue-500" />
                                Marine Conditions
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                                <div className="p-4 bg-blue-50 rounded-xl text-center">
                                    <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                    <p className="text-lg font-bold text-gray-900">{weatherData.marine.tide_high_time}</p>
                                    <p className="text-sm text-gray-500">High Tide</p>
                                </div>
                                <div className="p-4 bg-indigo-50 rounded-xl text-center">
                                    <TrendingDown className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                                    <p className="text-lg font-bold text-gray-900">{weatherData.marine.tide_low_time}</p>
                                    <p className="text-sm text-gray-500">Low Tide</p>
                                </div>
                                <div className="p-4 bg-cyan-50 rounded-xl text-center">
                                    <Thermometer className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                                    <p className="text-lg font-bold text-gray-900">{convertTemp(weatherData.marine.water_temp)}{tempUnit}</p>
                                    <p className="text-sm text-gray-500">Water Temp</p>
                                </div>
                                <div className="p-4 bg-teal-50 rounded-xl text-center">
                                    <Waves className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                                    <p className="text-lg font-bold text-gray-900">{weatherData.marine.wave_height}m</p>
                                    <p className="text-sm text-gray-500">Wave Height</p>
                                </div>
                                <div className="p-4 bg-emerald-50 rounded-xl text-center">
                                    <Navigation className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                    <p className="text-lg font-bold text-gray-900 capitalize">{weatherData.marine.current_strength}</p>
                                    <p className="text-sm text-gray-500">Current</p>
                                </div>
                                <div className="p-4 bg-sky-50 rounded-xl text-center">
                                    <Eye className="w-8 h-8 text-sky-500 mx-auto mb-2" />
                                    <p className="text-lg font-bold text-gray-900 capitalize">{weatherData.marine.visibility_marine}</p>
                                    <p className="text-sm text-gray-500">Visibility</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'lifestyle' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            <p className="text-sm text-green-600 mt-2 font-medium">
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
                            <Leaf className="w-5 h-5 text-emerald-500" />
                            Gardening Tip
                        </h3>
                        <div className="p-4 bg-emerald-50 rounded-xl">
                            <p className="text-gray-700">{weatherData?.lifestyle?.gardening_tip}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            Energy Saving Tip
                        </h3>
                        <div className="p-4 bg-amber-50 rounded-xl">
                            <p className="text-gray-700">{weatherData?.lifestyle?.energy_tip}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-500" />
                            Activity Ratings
                        </h3>
                        <div className="space-y-2">
                            {[
                                { activity: 'Running', rating: weatherData?.current?.temperature > 5 && weatherData?.current?.temperature < 25 ? 5 : 3 },
                                { activity: 'Cycling', rating: weatherData?.current?.wind_speed < 20 ? 5 : 2 },
                                { activity: 'Photography', rating: weatherData?.sun_moon?.golden_hour_morning ? 5 : 4 },
                                { activity: 'Stargazing', rating: weatherData?.current?.cloud_cover < 30 ? 5 : 2 },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700 text-sm">{item.activity}</span>
                                    <div className="flex gap-0.5">
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

            {activeTab === 'specialized' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ski/Snow Conditions */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Snowflake className="w-5 h-5 text-cyan-500" />
                            Ski & Snow Report
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-cyan-50 rounded-lg text-center">
                                <p className="text-2xl font-bold text-cyan-600">{weatherData?.specialized?.ski?.snow_depth || 0}cm</p>
                                <p className="text-xs text-gray-500">Snow Depth</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg text-center">
                                <p className="text-2xl font-bold text-blue-600">{weatherData?.specialized?.ski?.new_snow || 0}cm</p>
                                <p className="text-xs text-gray-500">Fresh Snow</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg text-center">
                                <p className="text-lg font-bold text-gray-700 capitalize">{weatherData?.specialized?.ski?.slope_status}</p>
                                <p className="text-xs text-gray-500">Slope Status</p>
                            </div>
                            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${getRiskColor(weatherData?.specialized?.ski?.avalanche_risk?.toLowerCase())}20` }}>
                                <p className="text-lg font-bold capitalize" style={{ color: getRiskColor(weatherData?.specialized?.ski?.avalanche_risk?.toLowerCase()) }}>{weatherData?.specialized?.ski?.avalanche_risk}</p>
                                <p className="text-xs text-gray-500">Avalanche Risk</p>
                            </div>
                        </div>
                    </div>

                    {/* Aviation Weather */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Plane className="w-5 h-5 text-indigo-500" />
                            Aviation Weather
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-indigo-50 rounded-lg text-center">
                                <p className="text-2xl font-bold text-indigo-600">{weatherData?.specialized?.aviation?.ceiling || 0}ft</p>
                                <p className="text-xs text-gray-500">Ceiling</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg text-center">
                                <p className="text-2xl font-bold text-purple-600">{weatherData?.specialized?.aviation?.visibility || 0}km</p>
                                <p className="text-xs text-gray-500">Visibility</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg text-center">
                                <p className="text-2xl font-bold text-gray-700">{weatherData?.specialized?.aviation?.wind_gust || 0}kt</p>
                                <p className="text-xs text-gray-500">Wind Gust</p>
                            </div>
                            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${getRiskColor(weatherData?.specialized?.aviation?.turbulence_risk?.toLowerCase())}20` }}>
                                <p className="text-lg font-bold capitalize" style={{ color: getRiskColor(weatherData?.specialized?.aviation?.turbulence_risk?.toLowerCase()) }}>{weatherData?.specialized?.aviation?.turbulence_risk}</p>
                                <p className="text-xs text-gray-500">Turbulence</p>
                            </div>
                        </div>
                    </div>

                    {/* Fishing Forecast */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Fish className="w-5 h-5 text-blue-500" />
                            Fishing Forecast
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-blue-50 rounded-lg flex justify-between items-center">
                                <span className="text-gray-600">Fish Activity</span>
                                <span className="font-bold capitalize" style={{ color: getRiskColor(weatherData?.specialized?.fishing?.fish_activity === 'high' ? 'high' : weatherData?.specialized?.fishing?.fish_activity === 'medium' ? 'medium' : 'low') }}>{weatherData?.specialized?.fishing?.fish_activity}</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                                <span className="text-gray-600">Best Time</span>
                                <span className="font-medium text-gray-900">{weatherData?.specialized?.fishing?.best_time}</span>
                            </div>
                            <div className="p-3 bg-cyan-50 rounded-lg flex justify-between items-center">
                                <span className="text-gray-600">Water Clarity</span>
                                <span className="font-medium text-cyan-700 capitalize">{weatherData?.specialized?.fishing?.water_clarity}</span>
                            </div>
                        </div>
                    </div>

                    {/* Farming Conditions */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <TreePine className="w-5 h-5 text-green-500" />
                            Farming Conditions
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 rounded-lg flex justify-between items-center" style={{ backgroundColor: `${getRiskColor(weatherData?.specialized?.farming?.frost_risk?.toLowerCase())}20` }}>
                                <span className="text-gray-600">Frost Risk</span>
                                <span className="font-bold capitalize" style={{ color: getRiskColor(weatherData?.specialized?.farming?.frost_risk?.toLowerCase()) }}>{weatherData?.specialized?.farming?.frost_risk}</span>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg flex justify-between items-center">
                                <span className="text-gray-600">Growing Conditions</span>
                                <span className="font-medium text-green-700 capitalize">{weatherData?.specialized?.farming?.growing_conditions}</span>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg flex justify-between items-center">
                                <span className="text-gray-600">Irrigation Need</span>
                                <span className="font-medium text-blue-700 capitalize">{weatherData?.specialized?.farming?.irrigation_need}</span>
                            </div>
                            <div className="p-3 bg-amber-50 rounded-lg flex justify-between items-center">
                                <span className="text-gray-600">Soil Temperature</span>
                                <span className="font-bold text-amber-700">{convertTemp(weatherData?.specialized?.farming?.soil_temp)}{tempUnit}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'climate' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-500" />
                            Precipitation Year-to-Date
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={precipitationComparisonData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 11 }} unit="mm" />
                                    <YAxis type="category" dataKey="name" tick={{ fill: '#6B7280', fontSize: 11 }} width={60} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} formatter={(value) => [`${value}mm`, 'Precipitation']} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {precipitationComparisonData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-purple-500" />
                            Climate Insights
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-purple-50 rounded-xl">
                                <p className="font-medium text-purple-800">Seasonal Comparison</p>
                                <p className="text-gray-700 mt-1">{weatherData?.climate?.seasonal_comparison}</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <p className="font-medium text-blue-800">Climate Trend</p>
                                <p className="text-gray-700 mt-1">{weatherData?.climate?.climate_trend}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'community' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Camera className="w-5 h-5 text-pink-500" />
                            Photo Challenge
                        </h3>
                        <div className="p-4 bg-pink-50 rounded-xl text-center">
                            <p className="text-gray-700 mb-3">Today's Challenge: Capture the {weatherData?.current?.condition} sky!</p>
                            <Button className="bg-pink-500 hover:bg-pink-600">
                                <Camera className="w-4 h-4 mr-2" /> Share Photo
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-amber-500" />
                            Your Badges
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {['🌤️ Weather Watcher', '🔥 7 Day Streak', '📸 Photo Pro', '⚡ Early Bird', '🌙 Night Owl', '❄️ Snow Spotter'].map((badge, i) => (
                                <div key={i} className={`p-2 rounded-lg text-center text-xs ${i < 3 ? 'bg-amber-50' : 'bg-gray-100 opacity-50'}`}>
                                    {badge}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-blue-500" />
                            Share Weather
                        </h3>
                        <div className="p-4 bg-blue-50 rounded-xl">
                            <p className="text-sm text-gray-700 mb-3">Share current conditions with friends!</p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Twitter</Button>
                                <Button variant="outline" size="sm">Facebook</Button>
                                <Button variant="outline" size="sm">Copy Link</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}