import path from "path";
import webpack from "webpack";

export default (env: any) => {
  const build = env.build || "production";

  const config: webpack.Configuration = {
    mode: build,
    entry: path.resolve(__dirname, "index.ts"),
    output: {
      clean: true,
      path: path.resolve(__dirname, "build"),
      filename: "[name].[contenthash].bundle.js",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
      preferAbsolute: true,
      modules: ["node_modules"],
    },
    target: "node",
  };

  return config;
};
