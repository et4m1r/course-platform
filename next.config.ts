import type {NextConfig} from "next"

const nextConfig: NextConfig = {
    transpilePackages: ['@mdxeditor/editor'],
    reactStrictMode: true,
    /* config options here */
    experimental: {
        useCache: true, // Enable "use cache" for stable versions
        turbo: {
            rules: {
                // Include the default rules
                // This ensures compatibility with existing webpack configurations
                include: ['**/*'],
            },
            // Resolve modules using Node.js resolution
            resolveAlias: {
                // Add any custom aliases here if needed
            }
        }
    }, webpack: (config) => {
        // this will override the experiments
        config.experiments = {...config.experiments, topLevelAwait: true}
        // this will just update topLevelAwait property of config.experiments
        // config.experiments.topLevelAwait = true
        return config
    },
    pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
}

export default nextConfig
