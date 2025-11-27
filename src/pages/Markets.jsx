import React, { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCw, TrendingUp, TrendingDown, Shield, Zap, DollarSign, BarChart3, Activity } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StockCard from '../components/markets/StockCard';
import StockTicker from '../components/markets/StockTicker';
import FilterChips from '../components/markets/FilterChips';
import StockDetailModal from '../components/markets/StockDetailModal';

const PRESET_FILTERS = [
    { id: 'all', label: 'All Stocks', icon: BarChart3 },
    { id: 'wide-moats', label: 'Wide Moats', icon: Shield },
    { id: 'undervalued', label: 'Undervalued', icon: DollarSign },
    { id: 'high-growth', label: 'High Growth', icon: TrendingUp },
    { id: 'top-movers', label: 'Top Movers', icon: Activity },
];

const FILTER_OPTIONS = {
    moat: { label: 'MOAT', options: ['Any', '70+', '60+', '50+'] },
    roe: { label: 'ROE', options: ['Any', '20%+', '15%+', '10%+'] },
    pe: { label: 'P/E', options: ['Any', '<15', '<20', '<30'] },
    zscore: { label: 'Z-Score', options: ['Any', '3+', '2.5+', '2+'] },
};

const STOCK_DATA = [
    { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology', industry: 'Consumer Electronics', marketCap: '2890' },
    { ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', industry: 'Software', marketCap: '2780' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', industry: 'Internet Services', marketCap: '1720' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer', industry: 'E-Commerce', marketCap: '1540' },
    { ticker: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', industry: 'Semiconductors', marketCap: '1180' },
    { ticker: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', industry: 'Social Media', marketCap: '890' },
    { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive', industry: 'Electric Vehicles', marketCap: '780' },
    { ticker: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Finance', industry: 'Conglomerate', marketCap: '750' },
    { ticker: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Finance', industry: 'Banking', marketCap: '520' },
    { ticker: 'V', name: 'Visa Inc.', sector: 'Finance', industry: 'Payments', marketCap: '480' },
    { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', industry: 'Pharmaceuticals', marketCap: '420' },
    { ticker: 'WMT', name: 'Walmart Inc.', sector: 'Consumer', industry: 'Retail', marketCap: '410' },
    { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer', industry: 'Consumer Goods', marketCap: '380' },
    { ticker: 'MA', name: 'Mastercard Inc.', sector: 'Finance', industry: 'Payments', marketCap: '390' },
    { ticker: 'HD', name: 'Home Depot Inc.', sector: 'Consumer', industry: 'Home Improvement', marketCap: '340' },
    { ticker: 'XOM', name: 'Exxon Mobil Corp.', sector: 'Energy', industry: 'Oil & Gas', marketCap: '460' },
    { ticker: 'CVX', name: 'Chevron Corp.', sector: 'Energy', industry: 'Oil & Gas', marketCap: '290' },
    { ticker: 'BAC', name: 'Bank of America', sector: 'Finance', industry: 'Banking', marketCap: '270' },
    { ticker: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare', industry: 'Biotechnology', marketCap: '280' },
    { ticker: 'KO', name: 'Coca-Cola Company', sector: 'Consumer', industry: 'Beverages', marketCap: '260' },
    { ticker: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer', industry: 'Beverages', marketCap: '230' },
    { ticker: 'COST', name: 'Costco Wholesale', sector: 'Consumer', industry: 'Retail', marketCap: '250' },
    { ticker: 'MRK', name: 'Merck & Co.', sector: 'Healthcare', industry: 'Pharmaceuticals', marketCap: '270' },
    { ticker: 'TMO', name: 'Thermo Fisher Scientific', sector: 'Healthcare', industry: 'Life Sciences', marketCap: '210' },
    { ticker: 'AVGO', name: 'Broadcom Inc.', sector: 'Technology', industry: 'Semiconductors', marketCap: '360' },
    { ticker: 'CSCO', name: 'Cisco Systems', sector: 'Technology', industry: 'Networking', marketCap: '220' },
    { ticker: 'ACN', name: 'Accenture plc', sector: 'Technology', industry: 'IT Services', marketCap: '200' },
    { ticker: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', industry: 'Software', marketCap: '240' },
    { ticker: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', industry: 'Cloud Software', marketCap: '250' },
    { ticker: 'INTC', name: 'Intel Corporation', sector: 'Technology', industry: 'Semiconductors', marketCap: '180' },
    { ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology', industry: 'Semiconductors', marketCap: '220' },
    { ticker: 'IBM', name: 'IBM Corporation', sector: 'Technology', industry: 'IT Services', marketCap: '150' },
    { ticker: 'ORCL', name: 'Oracle Corporation', sector: 'Technology', industry: 'Software', marketCap: '310' },
    { ticker: 'QCOM', name: 'Qualcomm Inc.', sector: 'Technology', industry: 'Semiconductors', marketCap: '170' },
    { ticker: 'NOW', name: 'ServiceNow Inc.', sector: 'Technology', industry: 'Cloud Software', marketCap: '150' },
    { ticker: 'INTU', name: 'Intuit Inc.', sector: 'Technology', industry: 'Software', marketCap: '170' },
    { ticker: 'SNOW', name: 'Snowflake Inc.', sector: 'Technology', industry: 'Cloud Data', marketCap: '65' },
    { ticker: 'PLTR', name: 'Palantir Technologies', sector: 'Technology', industry: 'Data Analytics', marketCap: '45' },
    { ticker: 'CRWD', name: 'CrowdStrike Holdings', sector: 'Technology', industry: 'Cybersecurity', marketCap: '72' },
    { ticker: 'NKE', name: 'Nike Inc.', sector: 'Consumer', industry: 'Apparel', marketCap: '150' },
    { ticker: 'LOW', name: 'Lowes Companies', sector: 'Consumer', industry: 'Home Improvement', marketCap: '130' },
    { ticker: 'SBUX', name: 'Starbucks Corporation', sector: 'Consumer', industry: 'Restaurants', marketCap: '105' },
    { ticker: 'TGT', name: 'Target Corporation', sector: 'Consumer', industry: 'Retail', marketCap: '72' },
    { ticker: 'MCD', name: 'McDonalds Corporation', sector: 'Consumer', industry: 'Restaurants', marketCap: '205' },
    { ticker: 'DIS', name: 'Walt Disney Company', sector: 'Media', industry: 'Entertainment', marketCap: '175' },
    { ticker: 'NFLX', name: 'Netflix Inc.', sector: 'Media', industry: 'Streaming', marketCap: '195' },
    { ticker: 'PYPL', name: 'PayPal Holdings', sector: 'Finance', industry: 'Fintech', marketCap: '68' },
    { ticker: 'GS', name: 'Goldman Sachs', sector: 'Finance', industry: 'Investment Banking', marketCap: '135' },
    { ticker: 'MS', name: 'Morgan Stanley', sector: 'Finance', industry: 'Investment Banking', marketCap: '150' },
    { ticker: 'AXP', name: 'American Express', sector: 'Finance', industry: 'Credit Services', marketCap: '165' },
    { ticker: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare', industry: 'Health Insurance', marketCap: '480' },
    { ticker: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', industry: 'Pharmaceuticals', marketCap: '160' },
    { ticker: 'LLY', name: 'Eli Lilly and Company', sector: 'Healthcare', industry: 'Pharmaceuticals', marketCap: '550' },
    { ticker: 'AMGN', name: 'Amgen Inc.', sector: 'Healthcare', industry: 'Biotechnology', marketCap: '150' },
    { ticker: 'GILD', name: 'Gilead Sciences', sector: 'Healthcare', industry: 'Biotechnology', marketCap: '100' },
    { ticker: 'BMY', name: 'Bristol-Myers Squibb', sector: 'Healthcare', industry: 'Pharmaceuticals', marketCap: '95' },
    { ticker: 'REGN', name: 'Regeneron Pharmaceuticals', sector: 'Healthcare', industry: 'Biotechnology', marketCap: '95' },
    { ticker: 'VRTX', name: 'Vertex Pharmaceuticals', sector: 'Healthcare', industry: 'Biotechnology', marketCap: '110' },
    { ticker: 'MRNA', name: 'Moderna Inc.', sector: 'Healthcare', industry: 'Biotechnology', marketCap: '45' },
    { ticker: 'BA', name: 'Boeing Company', sector: 'Industrials', industry: 'Aerospace', marketCap: '130' },
    { ticker: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrials', industry: 'Machinery', marketCap: '160' },
    { ticker: 'GE', name: 'General Electric', sector: 'Industrials', industry: 'Conglomerate', marketCap: '180' },
    { ticker: 'MMM', name: '3M Company', sector: 'Industrials', industry: 'Conglomerate', marketCap: '55' },
    { ticker: 'UPS', name: 'United Parcel Service', sector: 'Industrials', industry: 'Logistics', marketCap: '110' },
    { ticker: 'DE', name: 'Deere & Company', sector: 'Industrials', industry: 'Machinery', marketCap: '120' },
    { ticker: 'LMT', name: 'Lockheed Martin', sector: 'Industrials', industry: 'Defense', marketCap: '120' },
    { ticker: 'RTX', name: 'RTX Corporation', sector: 'Industrials', industry: 'Aerospace & Defense', marketCap: '140' },
    { ticker: 'HON', name: 'Honeywell International', sector: 'Industrials', industry: 'Conglomerate', marketCap: '130' },
    { ticker: 'UNP', name: 'Union Pacific', sector: 'Industrials', industry: 'Railroads', marketCap: '140' },
    { ticker: 'NEE', name: 'NextEra Energy', sector: 'Utilities', industry: 'Electric Utilities', marketCap: '150' },
    { ticker: 'DUK', name: 'Duke Energy', sector: 'Utilities', industry: 'Electric Utilities', marketCap: '80' },
    { ticker: 'SO', name: 'Southern Company', sector: 'Utilities', industry: 'Electric Utilities', marketCap: '85' },
    { ticker: 'T', name: 'AT&T Inc.', sector: 'Telecom', industry: 'Telecommunications', marketCap: '120' },
    { ticker: 'VZ', name: 'Verizon Communications', sector: 'Telecom', industry: 'Telecommunications', marketCap: '170' },
    { ticker: 'TMUS', name: 'T-Mobile US', sector: 'Telecom', industry: 'Telecommunications', marketCap: '200' },
    { ticker: 'COP', name: 'ConocoPhillips', sector: 'Energy', industry: 'Oil & Gas', marketCap: '130' },
    { ticker: 'EOG', name: 'EOG Resources', sector: 'Energy', industry: 'Oil & Gas', marketCap: '70' },
    { ticker: 'SLB', name: 'Schlumberger', sector: 'Energy', industry: 'Oil Services', marketCap: '65' },
    { ticker: 'LIN', name: 'Linde plc', sector: 'Materials', industry: 'Industrial Gases', marketCap: '200' },
    { ticker: 'APD', name: 'Air Products', sector: 'Materials', industry: 'Industrial Gases', marketCap: '65' },
    { ticker: 'SHW', name: 'Sherwin-Williams', sector: 'Materials', industry: 'Paints & Coatings', marketCap: '85' },
    { ticker: 'FCX', name: 'Freeport-McMoRan', sector: 'Materials', industry: 'Copper Mining', marketCap: '55' },
    { ticker: 'NEM', name: 'Newmont Corporation', sector: 'Materials', industry: 'Gold Mining', marketCap: '45' },
    { ticker: 'AMT', name: 'American Tower', sector: 'Real Estate', industry: 'REITs', marketCap: '95' },
    { ticker: 'PLD', name: 'Prologis Inc.', sector: 'Real Estate', industry: 'Industrial REITs', marketCap: '110' },
    { ticker: 'CCI', name: 'Crown Castle', sector: 'Real Estate', industry: 'REITs', marketCap: '45' },
    { ticker: 'EQIX', name: 'Equinix Inc.', sector: 'Real Estate', industry: 'Data Center REITs', marketCap: '75' },
    { ticker: 'SPG', name: 'Simon Property Group', sector: 'Real Estate', industry: 'Retail REITs', marketCap: '50' },
    { ticker: 'WFC', name: 'Wells Fargo', sector: 'Finance', industry: 'Banking', marketCap: '180' },
    { ticker: 'C', name: 'Citigroup Inc.', sector: 'Finance', industry: 'Banking', marketCap: '95' },
    { ticker: 'SCHW', name: 'Charles Schwab', sector: 'Finance', industry: 'Brokerage', marketCap: '120' },
    { ticker: 'BLK', name: 'BlackRock Inc.', sector: 'Finance', industry: 'Asset Management', marketCap: '115' },
    { ticker: 'SPGI', name: 'S&P Global', sector: 'Finance', industry: 'Financial Data', marketCap: '130' },
    { ticker: 'CME', name: 'CME Group', sector: 'Finance', industry: 'Exchanges', marketCap: '75' },
    { ticker: 'ICE', name: 'Intercontinental Exchange', sector: 'Finance', industry: 'Exchanges', marketCap: '70' },
    { ticker: 'AMAT', name: 'Applied Materials', sector: 'Technology', industry: 'Semiconductor Equipment', marketCap: '140' },
    { ticker: 'MU', name: 'Micron Technology', sector: 'Technology', industry: 'Memory Chips', marketCap: '95' },
    { ticker: 'LRCX', name: 'Lam Research', sector: 'Technology', industry: 'Semiconductor Equipment', marketCap: '95' },
    // Additional 100 stocks
    { ticker: 'ADI', name: 'Analog Devices', sector: 'Technology', industry: 'Semiconductors', marketCap: '100' },
    { ticker: 'TXN', name: 'Texas Instruments', sector: 'Technology', industry: 'Semiconductors', marketCap: '165' },
    { ticker: 'PANW', name: 'Palo Alto Networks', sector: 'Technology', industry: 'Cybersecurity', marketCap: '100' },
    { ticker: 'FTNT', name: 'Fortinet Inc.', sector: 'Technology', industry: 'Cybersecurity', marketCap: '55' },
    { ticker: 'ZS', name: 'Zscaler Inc.', sector: 'Technology', industry: 'Cybersecurity', marketCap: '28' },
    { ticker: 'DDOG', name: 'Datadog Inc.', sector: 'Technology', industry: 'Cloud Monitoring', marketCap: '38' },
    { ticker: 'NET', name: 'Cloudflare Inc.', sector: 'Technology', industry: 'Cloud Services', marketCap: '28' },
    { ticker: 'WDAY', name: 'Workday Inc.', sector: 'Technology', industry: 'HR Software', marketCap: '60' },
    { ticker: 'TEAM', name: 'Atlassian Corp.', sector: 'Technology', industry: 'Software', marketCap: '45' },
    { ticker: 'MDB', name: 'MongoDB Inc.', sector: 'Technology', industry: 'Database', marketCap: '25' },
    { ticker: 'SHOP', name: 'Shopify Inc.', sector: 'Technology', industry: 'E-Commerce Platform', marketCap: '95' },
    { ticker: 'SQ', name: 'Block Inc.', sector: 'Finance', industry: 'Fintech', marketCap: '42' },
    { ticker: 'UBER', name: 'Uber Technologies', sector: 'Technology', industry: 'Ride-sharing', marketCap: '145' },
    { ticker: 'ABNB', name: 'Airbnb Inc.', sector: 'Consumer', industry: 'Travel', marketCap: '85' },
    { ticker: 'BKNG', name: 'Booking Holdings', sector: 'Consumer', industry: 'Travel', marketCap: '130' },
    { ticker: 'MAR', name: 'Marriott International', sector: 'Consumer', industry: 'Hotels', marketCap: '70' },
    { ticker: 'HLT', name: 'Hilton Worldwide', sector: 'Consumer', industry: 'Hotels', marketCap: '55' },
    { ticker: 'CMG', name: 'Chipotle Mexican Grill', sector: 'Consumer', industry: 'Restaurants', marketCap: '75' },
    { ticker: 'YUM', name: 'Yum! Brands', sector: 'Consumer', industry: 'Restaurants', marketCap: '38' },
    { ticker: 'DPZ', name: 'Dominos Pizza', sector: 'Consumer', industry: 'Restaurants', marketCap: '15' },
    { ticker: 'LULU', name: 'Lululemon Athletica', sector: 'Consumer', industry: 'Apparel', marketCap: '45' },
    { ticker: 'EA', name: 'Electronic Arts', sector: 'Media', industry: 'Video Games', marketCap: '38' },
    { ticker: 'TTWO', name: 'Take-Two Interactive', sector: 'Media', industry: 'Video Games', marketCap: '28' },
    { ticker: 'RBLX', name: 'Roblox Corp.', sector: 'Media', industry: 'Gaming Platform', marketCap: '28' },
    { ticker: 'SPOT', name: 'Spotify Technology', sector: 'Media', industry: 'Music Streaming', marketCap: '65' },
    { ticker: 'COIN', name: 'Coinbase Global', sector: 'Finance', industry: 'Cryptocurrency', marketCap: '45' },
    { ticker: 'GM', name: 'General Motors', sector: 'Automotive', industry: 'Automobiles', marketCap: '55' },
    { ticker: 'F', name: 'Ford Motor Company', sector: 'Automotive', industry: 'Automobiles', marketCap: '45' },
    { ticker: 'RIVN', name: 'Rivian Automotive', sector: 'Automotive', industry: 'Electric Vehicles', marketCap: '15' },
    { ticker: 'FDX', name: 'FedEx Corporation', sector: 'Industrials', industry: 'Logistics', marketCap: '65' },
    { ticker: 'CSX', name: 'CSX Corporation', sector: 'Industrials', industry: 'Railroads', marketCap: '65' },
    { ticker: 'NSC', name: 'Norfolk Southern', sector: 'Industrials', industry: 'Railroads', marketCap: '50' },
    { ticker: 'WM', name: 'Waste Management', sector: 'Industrials', industry: 'Waste Services', marketCap: '80' },
    { ticker: 'ETN', name: 'Eaton Corporation', sector: 'Industrials', industry: 'Electrical Equipment', marketCap: '110' },
    { ticker: 'EMR', name: 'Emerson Electric', sector: 'Industrials', industry: 'Industrial Automation', marketCap: '60' },
    { ticker: 'ABT', name: 'Abbott Laboratories', sector: 'Healthcare', industry: 'Medical Devices', marketCap: '190' },
    { ticker: 'DHR', name: 'Danaher Corporation', sector: 'Healthcare', industry: 'Life Sciences', marketCap: '180' },
    { ticker: 'MDT', name: 'Medtronic plc', sector: 'Healthcare', industry: 'Medical Devices', marketCap: '105' },
    { ticker: 'SYK', name: 'Stryker Corporation', sector: 'Healthcare', industry: 'Medical Devices', marketCap: '120' },
    { ticker: 'ISRG', name: 'Intuitive Surgical', sector: 'Healthcare', industry: 'Medical Devices', marketCap: '145' },
    { ticker: 'BSX', name: 'Boston Scientific', sector: 'Healthcare', industry: 'Medical Devices', marketCap: '85' },
    { ticker: 'CI', name: 'Cigna Group', sector: 'Healthcare', industry: 'Health Insurance', marketCap: '95' },
    { ticker: 'CVS', name: 'CVS Health', sector: 'Healthcare', industry: 'Healthcare Services', marketCap: '75' },
    { ticker: 'SNPS', name: 'Synopsys Inc.', sector: 'Technology', industry: 'EDA Software', marketCap: '80' },
    { ticker: 'CDNS', name: 'Cadence Design', sector: 'Technology', industry: 'EDA Software', marketCap: '75' },
    { ticker: 'KLAC', name: 'KLA Corporation', sector: 'Technology', industry: 'Semiconductor Equipment', marketCap: '85' },
    { ticker: 'MRVL', name: 'Marvell Technology', sector: 'Technology', industry: 'Semiconductors', marketCap: '60' },
    { ticker: 'ON', name: 'ON Semiconductor', sector: 'Technology', industry: 'Semiconductors', marketCap: '35' },
    { ticker: 'NXPI', name: 'NXP Semiconductors', sector: 'Technology', industry: 'Semiconductors', marketCap: '55' },
    { ticker: 'DELL', name: 'Dell Technologies', sector: 'Technology', industry: 'Computer Hardware', marketCap: '85' },
    { ticker: 'HPQ', name: 'HP Inc.', sector: 'Technology', industry: 'Computer Hardware', marketCap: '35' },
    { ticker: 'NTAP', name: 'NetApp Inc.', sector: 'Technology', industry: 'Data Storage', marketCap: '22' },
    { ticker: 'OKTA', name: 'Okta Inc.', sector: 'Technology', industry: 'Identity Management', marketCap: '15' },
    { ticker: 'TWLO', name: 'Twilio Inc.', sector: 'Technology', industry: 'Communications API', marketCap: '12' },
    { ticker: 'ZM', name: 'Zoom Video', sector: 'Technology', industry: 'Video Communications', marketCap: '22' },
    { ticker: 'DOCU', name: 'DocuSign Inc.', sector: 'Technology', industry: 'E-Signature', marketCap: '12' },
    { ticker: 'TTD', name: 'The Trade Desk', sector: 'Technology', industry: 'Ad Tech', marketCap: '45' },
    { ticker: 'U', name: 'Unity Software', sector: 'Technology', industry: 'Game Engine', marketCap: '12' },
    { ticker: 'TER', name: 'Teradyne Inc.', sector: 'Technology', industry: 'Test Equipment', marketCap: '18' },
    { ticker: 'ENTG', name: 'Entegris Inc.', sector: 'Technology', industry: 'Semiconductor Materials', marketCap: '18' },
    { ticker: 'MPWR', name: 'Monolithic Power', sector: 'Technology', industry: 'Power Semiconductors', marketCap: '35' },
    { ticker: 'VST', name: 'Vistra Corp.', sector: 'Utilities', industry: 'Independent Power', marketCap: '35' },
    { ticker: 'CEG', name: 'Constellation Energy', sector: 'Utilities', industry: 'Nuclear Power', marketCap: '55' },
    { ticker: 'PCG', name: 'PG&E Corporation', sector: 'Utilities', industry: 'Electric Utilities', marketCap: '45' },
    { ticker: 'EXC', name: 'Exelon Corporation', sector: 'Utilities', industry: 'Electric Utilities', marketCap: '42' },
    { ticker: 'SRE', name: 'Sempra Energy', sector: 'Utilities', industry: 'Multi-Utilities', marketCap: '52' },
    { ticker: 'D', name: 'Dominion Energy', sector: 'Utilities', industry: 'Electric Utilities', marketCap: '45' },
    { ticker: 'AEP', name: 'American Electric Power', sector: 'Utilities', industry: 'Electric Utilities', marketCap: '50' },
    { ticker: 'AWK', name: 'American Water Works', sector: 'Utilities', industry: 'Water Utilities', marketCap: '28' },
    { ticker: 'OXY', name: 'Occidental Petroleum', sector: 'Energy', industry: 'Oil & Gas', marketCap: '55' },
    { ticker: 'HES', name: 'Hess Corporation', sector: 'Energy', industry: 'Oil & Gas', marketCap: '45' },
    { ticker: 'DVN', name: 'Devon Energy', sector: 'Energy', industry: 'Oil & Gas', marketCap: '28' },
    { ticker: 'FANG', name: 'Diamondback Energy', sector: 'Energy', industry: 'Oil & Gas', marketCap: '32' },
    { ticker: 'VLO', name: 'Valero Energy', sector: 'Energy', industry: 'Refining', marketCap: '45' },
    { ticker: 'MPC', name: 'Marathon Petroleum', sector: 'Energy', industry: 'Refining', marketCap: '55' },
    { ticker: 'PSX', name: 'Phillips 66', sector: 'Energy', industry: 'Refining', marketCap: '52' },
    { ticker: 'BKR', name: 'Baker Hughes', sector: 'Energy', industry: 'Oil Services', marketCap: '35' },
    { ticker: 'HAL', name: 'Halliburton Company', sector: 'Energy', industry: 'Oil Services', marketCap: '28' },
    { ticker: 'CL', name: 'Colgate-Palmolive', sector: 'Consumer', industry: 'Personal Products', marketCap: '75' },
    { ticker: 'EL', name: 'Estee Lauder', sector: 'Consumer', industry: 'Cosmetics', marketCap: '45' },
    { ticker: 'MNST', name: 'Monster Beverage', sector: 'Consumer', industry: 'Beverages', marketCap: '55' },
    { ticker: 'KDP', name: 'Keurig Dr Pepper', sector: 'Consumer', industry: 'Beverages', marketCap: '45' },
    { ticker: 'STZ', name: 'Constellation Brands', sector: 'Consumer', industry: 'Beverages', marketCap: '45' },
    { ticker: 'HSY', name: 'Hershey Company', sector: 'Consumer', industry: 'Confectionery', marketCap: '45' },
    { ticker: 'GIS', name: 'General Mills', sector: 'Consumer', industry: 'Packaged Foods', marketCap: '42' },
    { ticker: 'SYY', name: 'Sysco Corporation', sector: 'Consumer', industry: 'Food Distribution', marketCap: '42' },
    { ticker: 'TJX', name: 'TJX Companies', sector: 'Consumer', industry: 'Discount Retail', marketCap: '120' },
    { ticker: 'ROST', name: 'Ross Stores', sector: 'Consumer', industry: 'Discount Retail', marketCap: '52' },
    { ticker: 'DG', name: 'Dollar General', sector: 'Consumer', industry: 'Discount Retail', marketCap: '35' },
    { ticker: 'DLTR', name: 'Dollar Tree', sector: 'Consumer', industry: 'Discount Retail', marketCap: '32' },
    { ticker: 'BBY', name: 'Best Buy', sector: 'Consumer', industry: 'Electronics Retail', marketCap: '18' },
    { ticker: 'ULTA', name: 'Ulta Beauty', sector: 'Consumer', industry: 'Beauty Retail', marketCap: '22' },
    { ticker: 'GPS', name: 'Gap Inc.', sector: 'Consumer', industry: 'Apparel Retail', marketCap: '10' },
    { ticker: 'ANF', name: 'Abercrombie & Fitch', sector: 'Consumer', industry: 'Apparel Retail', marketCap: '8' },
    { ticker: 'DECK', name: 'Deckers Outdoor', sector: 'Consumer', industry: 'Footwear', marketCap: '25' },
    { ticker: 'CROX', name: 'Crocs Inc.', sector: 'Consumer', industry: 'Footwear', marketCap: '8' },
    { ticker: 'SKX', name: 'Skechers U.S.A.', sector: 'Consumer', industry: 'Footwear', marketCap: '12' },
    { ticker: 'CHWY', name: 'Chewy Inc.', sector: 'Consumer', industry: 'E-Commerce', marketCap: '10' },
    { ticker: 'KMX', name: 'CarMax Inc.', sector: 'Consumer', industry: 'Used Cars', marketCap: '12' },
];

function generateStockData(stockInfo) {
    const basePrice = 50 + Math.random() * 450;
    const change = (Math.random() - 0.5) * 10;
    const moat = 45 + Math.floor(Math.random() * 50);
    const roe = 8 + Math.floor(Math.random() * 30);
    const pe = 10 + Math.floor(Math.random() * 35);
    const zscore = 1.5 + Math.random() * 3;
    const sgr = 5 + Math.floor(Math.random() * 25);
    const history = [];
    let price = basePrice * 0.85;
    for (let i = 0; i < 20; i++) { price = price * (1 + (Math.random() - 0.48) * 0.03); history.push(Math.round(price * 100) / 100); }
    return { ...stockInfo, price: Math.round(basePrice * 100) / 100, change: Math.round(change * 100) / 100, volume: `${(Math.random() * 50 + 5).toFixed(1)}M`, moat, sgr, roe, roic: roe - 2 + Math.floor(Math.random() * 5), roa: Math.floor(roe * 0.6), eps: Math.round((1 + Math.random() * 15) * 100) / 100, pe, peg: Math.round((pe / sgr) * 100) / 100, fcf: Math.floor(Math.random() * 5000) + 500, eva: 40 + Math.floor(Math.random() * 50), zscore: Math.round(zscore * 100) / 100, dividend: Math.round(Math.random() * 4 * 100) / 100, beta: Math.round((0.7 + Math.random() * 0.8) * 100) / 100, aiRating: 55 + Math.floor(Math.random() * 40), history };
}

export default function Markets() {
    const [stocks, setStocks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activePreset, setActivePreset] = useState('all');
    const [filters, setFilters] = useState({ market: 'All Markets', sector: 'All Sectors', industry: 'All Industries', moat: 'Any', roe: 'Any', pe: 'Any', zscore: 'Any' });
    const [selectedStock, setSelectedStock] = useState(null);
    const [showStockModal, setShowStockModal] = useState(false);

    useEffect(() => { setStocks(STOCK_DATA.map(generateStockData)); }, []);

    const refreshStocks = () => setStocks(STOCK_DATA.map(generateStockData));
    const handleStockClick = (stock) => { setSelectedStock(stock); setShowStockModal(true); };

    const filteredStocks = useMemo(() => {
        let result = [...stocks];
        if (searchQuery) { const q = searchQuery.toLowerCase(); result = result.filter(s => s.ticker?.toLowerCase().includes(q) || s.name?.toLowerCase().includes(q) || s.sector?.toLowerCase().includes(q)); }
        if (activePreset === 'wide-moats') result = result.filter(s => s.moat >= 70);
        else if (activePreset === 'undervalued') result = result.filter(s => s.pe < 20);
        else if (activePreset === 'high-growth') result = result.filter(s => s.sgr >= 15);
        else if (activePreset === 'top-movers') result = result.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
        if (filters.moat !== 'Any') result = result.filter(s => s.moat >= parseInt(filters.moat));
        if (filters.roe !== 'Any') result = result.filter(s => s.roe >= parseInt(filters.roe));
        if (filters.pe !== 'Any') result = result.filter(s => s.pe < parseInt(filters.pe.replace('<', '')));
        if (filters.zscore !== 'Any') result = result.filter(s => s.zscore >= parseFloat(filters.zscore));
        if (filters.sector !== 'All Sectors') result = result.filter(s => s.sector === filters.sector);
        return result;
    }, [stocks, searchQuery, activePreset, filters]);

    const topMovers = useMemo(() => [...stocks].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 20), [stocks]);
    const sectors = useMemo(() => ['All Sectors', ...[...new Set(stocks.map(s => s.sector).filter(Boolean))].sort()], [stocks]);
    const clearFilters = () => { setFilters({ market: 'All Markets', sector: 'All Sectors', industry: 'All Industries', moat: 'Any', roe: 'Any', pe: 'Any', zscore: 'Any' }); setActivePreset('all'); setSearchQuery(''); };

    return (
        <div className="p-4 md:p-6">
            <div className="mb-4"><StockTicker stocks={topMovers} /></div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search stocks..." className="pl-12 h-12 rounded-full" />
                </div>
                <Button onClick={refreshStocks} variant="outline" size="sm" className="gap-2"><RefreshCw className="w-4 h-4" /> Refresh</Button>
                <span className="text-sm text-gray-500">{stocks.length} stocks</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {PRESET_FILTERS.map(preset => (<button key={preset.id} onClick={() => setActivePreset(preset.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${activePreset === preset.id ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'}`}><preset.icon className="w-4 h-4" />{preset.label}</button>))}
            </div>

            <FilterChips filters={filters} setFilters={setFilters} filterOptions={FILTER_OPTIONS} sectors={sectors} />

            <div className="flex items-center justify-between mb-4 mt-6">
                <p className="text-gray-600">Showing <span className="font-bold text-gray-900">{filteredStocks.length}</span> of {stocks.length} stocks</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredStocks.map((stock, i) => (<StockCard key={stock.ticker || i} stock={stock} onClick={handleStockClick} />))}
            </div>

            {filteredStocks.length === 0 && (<div className="text-center py-20"><BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500 mb-4">No stocks match your current filters</p><Button onClick={clearFilters} variant="outline">Clear All Filters</Button></div>)}

            <StockDetailModal stock={selectedStock} isOpen={showStockModal} onClose={() => setShowStockModal(false)} />
        </div>
    );
}