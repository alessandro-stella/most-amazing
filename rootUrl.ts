import { env } from "~/env.mjs";

const developmentUrl = "http://localhost:3000";
const productionUrl = "https://most-amazing-ecommerce.vercel.app/";

const url = env.NODE_ENV === "development" ? developmentUrl : productionUrl;

export default url;
