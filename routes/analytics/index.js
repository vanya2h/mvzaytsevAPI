import express from "express";
import { google } from "googleapis";
import { createError } from "@utils/createError";
import { auth } from "@middlewares/auth";
import { key } from "@root/google.auth";

const scopes = "https://www.googleapis.com/auth/analytics.readonly";
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes);

const router = express.Router();

router.get("/overview", auth(), async (req, res, next) => {
  try {
    await jwt.authorize();

    const month = await google.analytics("v3").data.ga.get({
      auth: jwt,
      ids: `ga:${process.env.GOOGLE_VIEW_ID}`,
      "start-date": "30daysAgo",
      "end-date": "today",
      metrics: "ga:sessions"
    });

    const today = await google.analytics("v3").data.ga.get({
      auth: jwt,
      ids: `ga:${process.env.GOOGLE_VIEW_ID}`,
      "start-date": "today",
      "end-date": "today",
      metrics: "ga:sessions"
    });

    const yesterday = await google.analytics("v3").data.ga.get({
      auth: jwt,
      ids: `ga:${process.env.GOOGLE_VIEW_ID}`,
      "start-date": "yesterday",
      "end-date": "yesterday",
      metrics: "ga:sessions"
    });

    return res.json({
      month: month.data.rows ? month.data.rows[0][0] : "0",
      yesterday: yesterday.data.rows ? yesterday.data.rows[0][0] : "0",
      today: today.data.rows ? today.data.rows[0][0] : "0"
    });
  } catch (reason) {
    return next(createError("Не удалось загрузить данные"), reason);
  }
});

export const analytics = router;
export default analytics;
