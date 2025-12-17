Deno.serve(async (req) => {
    try {
        const { ticker } = await req.json();
        
        if (!ticker) {
            return Response.json({ error: 'Ticker required' }, { status: 400 });
        }

        // Fetch real-time quote
        const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`;
        const chartRes = await fetch(chartUrl);
        const chartData = await chartRes.json();
        
        if (!chartData.chart?.result?.[0]) {
            return Response.json({ error: 'Invalid ticker' }, { status: 404 });
        }

        const chartResult = chartData.chart.result[0];
        const meta = chartResult.meta;
        
        // Fetch detailed statistics
        const statsUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=summaryDetail,defaultKeyStatistics,financialData,assetProfile`;
        const statsRes = await fetch(statsUrl);
        const statsData = await statsRes.json();
        const result = statsData.quoteSummary?.result?.[0] || {};
        
        const detail = result.summaryDetail || {};
        const stats = result.defaultKeyStatistics || {};
        const financial = result.financialData || {};
        const profile = result.assetProfile || {};
        
        const currentPrice = meta.regularMarketPrice;
        const previousClose = meta.chartPreviousClose;
        const change = ((currentPrice - previousClose) / previousClose) * 100;

        return Response.json({
            ticker: meta.symbol,
            name: meta.longName || meta.shortName || ticker,
            sector: profile.sector || 'Unknown',
            industry: profile.industry || 'Unknown',
            marketCap: meta.marketCap ? `$${(meta.marketCap / 1e9).toFixed(2)}B` : 'N/A',
            price: currentPrice,
            change: change,
            volume: meta.regularMarketVolume ? `${(meta.regularMarketVolume / 1e6).toFixed(2)}M` : 'N/A',
            pe: detail.trailingPE?.raw || null,
            eps: stats.trailingEps?.raw || null,
            dividend: detail.dividendYield?.raw ? (detail.dividendYield.raw * 100) : null,
            beta: stats.beta?.raw || null,
            roe: financial.returnOnEquity?.raw ? (financial.returnOnEquity.raw * 100) : null,
            roic: financial.returnOnAssets?.raw ? (financial.returnOnAssets.raw * 100) : null,
            roa: financial.returnOnAssets?.raw ? (financial.returnOnAssets.raw * 100) : null,
            peg: stats.pegRatio?.raw || null,
            fcf: financial.freeCashflow?.raw || null,
            debtToEquity: financial.debtToEquity?.raw || null,
            currentRatio: financial.currentRatio?.raw || null,
            quickRatio: financial.quickRatio?.raw || null,
            profitMargin: financial.profitMargins?.raw ? (financial.profitMargins.raw * 100) : null,
            operatingMargin: financial.operatingMargins?.raw ? (financial.operatingMargins.raw * 100) : null,
            grossMargin: financial.grossMargins?.raw ? (financial.grossMargins.raw * 100) : null,
            revenueGrowth: financial.revenueGrowth?.raw ? (financial.revenueGrowth.raw * 100) : null,
            earningsGrowth: financial.earningsGrowth?.raw ? (financial.earningsGrowth.raw * 100) : null
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});