Deno.serve(async (req) => {
    try {
        const { ticker } = await req.json();
        
        if (!ticker) {
            return Response.json({ error: 'Ticker required' }, { status: 400 });
        }

        // Fetch comprehensive data
        const quoteUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=price,summaryDetail,defaultKeyStatistics,financialData,assetProfile`;
        const quoteRes = await fetch(quoteUrl);
        const quoteData = await quoteRes.json();
        
        if (quoteData.quoteSummary?.error) {
            return Response.json({ error: 'Invalid ticker' }, { status: 404 });
        }

        const result = quoteData.quoteSummary?.result?.[0];
        if (!result) {
            return Response.json({ error: 'No data available' }, { status: 404 });
        }

        const price = result.price || {};
        const detail = result.summaryDetail || {};
        const stats = result.defaultKeyStatistics || {};
        const financial = result.financialData || {};
        const profile = result.assetProfile || {};
        
        const currentPrice = price.regularMarketPrice?.raw || detail.previousClose?.raw || 0;
        const previousClose = price.regularMarketPreviousClose?.raw || detail.previousClose?.raw || currentPrice;
        const change = previousClose > 0 ? ((currentPrice - previousClose) / previousClose) * 100 : 0;

        return Response.json({
            ticker: price.symbol || ticker,
            name: price.longName || price.shortName || ticker,
            sector: profile.sector || 'Unknown',
            industry: profile.industry || 'Unknown',
            marketCap: price.marketCap?.raw ? `$${(price.marketCap.raw / 1e9).toFixed(2)}B` : 'N/A',
            price: currentPrice,
            change: change,
            volume: price.regularMarketVolume?.raw ? `${(price.regularMarketVolume.raw / 1e6).toFixed(2)}M` : 'N/A',
            pe: detail.trailingPE?.raw || stats.trailingPE?.raw || null,
            eps: stats.trailingEps?.raw || detail.trailingEps?.raw || null,
            dividend: detail.dividendYield?.raw ? (detail.dividendYield.raw * 100) : null,
            beta: stats.beta?.raw || detail.beta?.raw || null,
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