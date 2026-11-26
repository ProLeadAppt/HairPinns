import { BUSINESS_NAP } from "../config/businessConfig";
import type { LocationPageData } from "./locationPages";

export const PRIORITY_LOCATION_SLUGS = [
  "bangor-2234",
  "menai-2234",
  "sutherland-2232",
  "kirrawee-2232",
  "cronulla-2230",
  "miranda-2228",
  "illawong-2234",
  "engadine-2233",
  "caringbah-2229",
  "gymea-2227",
] as const;

export type PriorityLocationSlug = (typeof PRIORITY_LOCATION_SLUGS)[number];

type PriorityLocationCopy = Pick<
  LocationPageData,
  "seoTitle" | "metaDescription" | "localIntro" | "faqs"
>;

const eveningNote =
  "Wednesday appointments run from 4pm to 9pm, and Thursday runs from 9am to 9pm.";

export const PRIORITY_LOCATION_COPY: Record<PriorityLocationSlug, PriorityLocationCopy> = {
  "bangor-2234": {
    seoTitle: "Hairdresser in Bangor NSW 2234 | Hair Pinns",
    metaDescription:
      "Appointment-only hair salon in Bangor at " + BUSINESS_NAP.address.street + ". One-on-one colour, blonding, smoothing and cuts with Jena. Book online or call " + BUSINESS_NAP.phone.display + ".",
    localIntro:
      "Hair Pinns is Jena Pinn's appointment-only studio at " + BUSINESS_NAP.address.street + ", Bangor NSW 2234. You book one-on-one time for colour, blonding, smoothing and cuts, with street parking at the salon. Wednesday runs from 4pm to 9pm and Thursday from 9am to 9pm. Check the live booking menu before you visit, or call " + BUSINESS_NAP.phone.display + ".",
    faqs: [
      {
        question: "Where is the hair salon in Bangor?",
        answer:
          "Hair Pinns is at " + BUSINESS_NAP.address.street + ", Bangor NSW 2234. Street parking is at the studio. Book online or call " + BUSINESS_NAP.phone.display + ".",
      },
      {
        question: "What are the Bangor studio hours?",
        answer:
          "Tuesday 9am to 5pm, Wednesday 4pm to 9pm, Thursday 9am to 9pm, Friday 9am to 5pm, and Saturday 8am to 2pm. Sunday and Monday are closed.",
      },
      {
        question: "Who does the hair at Hair Pinns in Bangor?",
        answer:
          "Jena Pinn works one-on-one. Hair Pinns is a single-chair studio, appointment only, for colour, blonding, smoothing and cuts.",
      },
    ],
  },
  "menai-2234": {
    seoTitle: "Hairdresser Near Menai NSW 2234 | Hair Pinns",
    metaDescription:
      "Looking for a hairdresser near Menai? Visit Hair Pinns in Bangor, 5 mins away with free parking, for colour, blonding, smoothing and cuts with Jena.",
    localIntro:
      "Menai Road links Menai with Bangor, a short trip many clients allow about 5 minutes for. Check live directions before you leave. Hair Pinns is Jena's appointment-only studio at " + BUSINESS_NAP.address.street + ", with street parking and a calmer visit than a shopping-centre salon. " +
      eveningNote,
    faqs: [
      {
        question: "How do I get from Menai to Hair Pinns?",
        answer:
          "Menai Road links Menai with Bangor. Many clients allow about 5 minutes, then check live directions before leaving. The studio is at " + BUSINESS_NAP.address.street + ", with street parking.",
      },
      {
        question: "Can I book an evening appointment from Menai?",
        answer:
          "Wednesday appointments run from 4pm to 9pm, and Thursday from 9am to 9pm. Book the live times online or call " + BUSINESS_NAP.phone.display + ".",
      },
      {
        question: "Is Hair Pinns a shopping-centre salon for Menai clients?",
        answer:
          "No. It is Jena's appointment-only studio in Bangor. You see Jena for colour, blonding, smoothing and cuts, one client at a time.",
      },
    ],
  },
  "sutherland-2232": {
    seoTitle: "Hairdresser Near Sutherland 2232 | Hair Pinns",
    metaDescription:
      "Hair salon near Sutherland in quiet Bangor, 8 to 10 mins away with easy parking. One-on-one colour, blonding, smoothing and cuts with Jena. Book online.",
    localIntro:
      "From Sutherland, the usual drive is north on Old Illawarra Road into Bangor, often about 8 to 10 minutes. Check live directions on the day. Hair Pinns is Jena's appointment-only studio at " + BUSINESS_NAP.address.street + ", with street parking, for one-on-one colour, blonding, smoothing and cuts rather than a rushed shopping-centre appointment. " +
      eveningNote,
    faqs: [
      {
        question: "Which road runs from Sutherland to the Bangor studio?",
        answer:
          "Old Illawarra Road is the usual route north into Bangor, often about 8 to 10 minutes. Check live directions before you leave. The studio is at " + BUSINESS_NAP.address.street + ".",
      },
      {
        question: "What should I book from Sutherland?",
        answer:
          "Jena works one-on-one on colour, blonding, smoothing and cuts. Open the booking page for the current menu, or call " + BUSINESS_NAP.phone.display + " if you want help choosing.",
      },
      {
        question: "Are there evening times for Sutherland clients?",
        answer:
          "Wednesday runs 4pm to 9pm and Thursday runs 9am to 9pm. Tuesday and Friday are 9am to 5pm, Saturday is 8am to 2pm, and Sunday and Monday are closed.",
      },
    ],
  },
  "kirrawee-2232": {
    seoTitle: "Hairdresser Near Kirrawee 2232 | Hair Pinns",
    metaDescription:
      "Need a hairdresser near Kirrawee? Hair Pinns in Bangor offers calm one-on-one colour, foils, smoothing and cuts with Jena and free parking. Book online.",
    localIntro:
      "From Kirrawee, a common drive is Oak Road or the Princes Highway onto Old Illawarra Road, then into Bangor. Check live directions for the current trip. Hair Pinns is Jena's appointment-only studio at " + BUSINESS_NAP.address.street + ", with street parking. Colour, foils, smoothing and cuts are one-on-one, without a shopping-centre queue. " +
      eveningNote,
    faqs: [
      {
        question: "How do Kirrawee clients reach Hair Pinns?",
        answer:
          "A common route is Oak Road or the Princes Highway onto Old Illawarra Road, then into Bangor. Check live directions. Street parking is at " + BUSINESS_NAP.address.street + ".",
      },
      {
        question: "Who does colour for clients coming from Kirrawee?",
        answer:
          "Jena does the appointment herself. Hair Pinns is a one-on-one studio for colour, foils, smoothing and cuts.",
      },
      {
        question: "Can I come after work from Kirrawee?",
        answer:
          "Wednesday is open 4pm to 9pm and Thursday is open 9am to 9pm. Book a live time online or call " + BUSINESS_NAP.phone.display + ".",
      },
    ],
  },
  "cronulla-2230": {
    seoTitle: "Hairdresser Near Cronulla 2230 | Hair Pinns",
    metaDescription:
      "Escape the busy beach strip for one-on-one colour, blonding, smoothing and cuts with Jena at Hair Pinns in Bangor. Free parking. Book online today.",
    localIntro:
      "Leave the Cronulla beach strip via the Kingsway, then continue toward Old Illawarra Road and Bangor. Check live directions before you set off. Hair Pinns is Jena's appointment-only studio at " + BUSINESS_NAP.address.street + ", with street parking. Colour, blonding, smoothing and cuts are one-on-one, away from the busier beach-strip salons. " +
      eveningNote,
    faqs: [
      {
        question: "Why drive from Cronulla to a salon in Bangor?",
        answer:
          "Hair Pinns is a quiet appointment-only studio, away from the beach-strip rush. The usual roads are the Kingsway and Old Illawarra Road. Check live directions, then park at " + BUSINESS_NAP.address.street + ".",
      },
      {
        question: "What does Jena offer clients travelling from Cronulla?",
        answer:
          "One-on-one colour, blonding, smoothing and cuts. Prices and times are on the live booking menu. Call " + BUSINESS_NAP.phone.display + " if you are unsure which service to choose.",
      },
      {
        question: "Can a Cronulla visit still work on a weeknight?",
        answer:
          "Wednesday is open 4pm to 9pm and Thursday is open 9am to 9pm, when a live time is free. Sunday and Monday are closed.",
      },
    ],
  },
  "miranda-2228": {
    seoTitle: "Hairdresser Near Miranda 2228 | Hair Pinns",
    metaDescription:
      "Skip shopping-centre crowds near Miranda. Visit Hair Pinns in Bangor for calm one-on-one colour, blonding, smoothing and cuts with Jena. Book online.",
    localIntro:
      "Skip the shopping-centre crowds around Miranda. The usual route is the Kingsway toward Old Illawarra Road, then north into Bangor. Check live directions for the current trip. Hair Pinns is Jena's appointment-only studio at " + BUSINESS_NAP.address.street + ", with street parking, for one-on-one colour, blonding, smoothing and cuts. " +
      eveningNote,
    faqs: [
      {
        question: "How is Hair Pinns different from a Miranda shopping-centre salon?",
        answer:
          "You book Jena one-on-one at " + BUSINESS_NAP.address.street + ", Bangor, with street parking at the studio. Check live directions via the Kingsway and Old Illawarra Road.",
      },
      {
        question: "What can I book if I am coming from Miranda?",
        answer:
          "Colour, blonding, smoothing and cuts. The booking page shows the current menu. Call " + BUSINESS_NAP.phone.display + " if you want help choosing before you travel.",
      },
      {
        question: "Which evenings suit a visit from Miranda?",
        answer:
          "Wednesday 4pm to 9pm and Thursday 9am to 9pm include evening times. Saturday is 8am to 2pm if you would rather come on the weekend.",
      },
    ],
  },
  "illawong-2234": {
    seoTitle: "Hairdresser Near Illawong 2234 | Hair Pinns",
    metaDescription:
      "Hair salon near Illawong at " + BUSINESS_NAP.address.street + ", Bangor, 8 to 10 mins away with free parking. One-on-one colour, smoothing and cuts with Jena. Book online.",
    localIntro:
      "Illawong to Bangor is a local drive via Fowler Road and Menai Road, often about 8 to 10 minutes. Check live directions on the day. Hair Pinns is Jena's appointment-only studio at " + BUSINESS_NAP.address.street + ", with street parking, for one-on-one colour, smoothing and cuts rather than a rushed shopping-centre visit. " +
      eveningNote,
    faqs: [
      {
        question: "How do I drive from Illawong to Hair Pinns?",
        answer:
          "Fowler Road and Menai Road are the usual local route, often about 8 to 10 minutes. Check live directions. Hair Pinns is at " + BUSINESS_NAP.address.street + ", with street parking.",
      },
      {
        question: "What happens at a first visit from Illawong?",
        answer:
          "Jena consults with you one-on-one, then does the colour, smoothing or cut you booked. The studio is appointment only.",
      },
      {
        question: "Can Illawong clients book after 5pm?",
        answer:
          "Wednesday is open until 9pm, and Thursday is open 9am to 9pm. Book online or call " + BUSINESS_NAP.phone.display + " to see the live times.",
      },
    ],
  },
  "engadine-2233": {
    seoTitle: "Hairdresser Near Engadine 2233 | Hair Pinns",
    metaDescription:
      "Hair salon near Engadine at Hair Pinns in Bangor. One-on-one colour, blonding, smoothing and cuts with Jena plus easy parking. Book online today.",
    localIntro:
      "From Engadine, head north on the Princes Highway and Old Illawarra Road toward Bangor. Check live directions before you leave. Hair Pinns is Jena's appointment-only studio at " + BUSINESS_NAP.address.street + ", with street parking and Wednesday and Thursday evening hours. Colour, blonding, smoothing and cuts are one-on-one, in a quiet Bangor studio rather than a shopping-centre salon.",
    faqs: [
      {
        question: "How do I drive from Engadine to Hair Pinns?",
        answer:
          "Head north on the Princes Highway and Old Illawarra Road toward Bangor, then check live directions. The studio is at " + BUSINESS_NAP.address.street + ", with street parking.",
      },
      {
        question: "What services can Engadine clients book?",
        answer:
          "Jena offers one-on-one colour, blonding, smoothing and cuts. Use the booking page for current services and times, or call " + BUSINESS_NAP.phone.display + ".",
      },
      {
        question: "Is there an evening option from Engadine?",
        answer:
          "Wednesday appointments run 4pm to 9pm and Thursday runs 9am to 9pm. Sunday and Monday are closed.",
      },
    ],
  },
  "caringbah-2229": {
    seoTitle: "Hairdresser Near Caringbah 2229 | Hair Pinns",
    metaDescription:
      "Hairdresser near Caringbah for one-on-one colour, foils, smoothing and cuts at Hair Pinns in Bangor. Free parking and online booking with Jena.",
    localIntro:
      "From Caringbah, a common route is the Kingsway through Miranda, then Old Illawarra Road north to Bangor. Check live directions for the current trip. Hair Pinns is Jena's appointment-only studio at " + BUSINESS_NAP.address.street + ", with street parking. Colour, foils, smoothing and cuts are booked one-on-one with Jena. " +
      eveningNote,
    faqs: [
      {
        question: "Which way do Caringbah clients drive to Bangor?",
        answer:
          "The Kingsway through Miranda, then Old Illawarra Road north, is a common route. Check live directions. Street parking is at " + BUSINESS_NAP.address.street + ".",
      },
      {
        question: "Who does foils for clients coming from Caringbah?",
        answer:
          "Jena does foils, colour, smoothing and cuts herself. Hair Pinns is a single-chair, appointment-only studio.",
      },
      {
        question: "How do I book from Caringbah?",
        answer:
          "Book online for a live time, or call " + BUSINESS_NAP.phone.display + ". Wednesday evening runs to 9pm and Thursday is open 9am to 9pm.",
      },
    ],
  },
  "gymea-2227": {
    seoTitle: "Hairdresser Near Gymea NSW 2227 | Hair Pinns",
    metaDescription:
      "Hair salon near Gymea in peaceful Bangor, 10 to 12 mins away with free parking. One-on-one colour, blonding, smoothing and cuts with Jena. Book online.",
    localIntro:
      "Gymea to Bangor usually follows the Kingsway or the Princes Highway onto Old Illawarra Road, often about 10 to 12 minutes. Check live directions on the day. Hair Pinns is Jena's appointment-only studio at " + BUSINESS_NAP.address.street + ", with street parking and Wednesday and Thursday evening hours, for calm one-on-one colour, blonding, smoothing and cuts.",
    faqs: [
      {
        question: "How long should I allow from Gymea to Bangor?",
        answer:
          "The Kingsway or Princes Highway onto Old Illawarra Road is the usual route, often about 10 to 12 minutes. Check live directions. The studio is at " + BUSINESS_NAP.address.street + ", with street parking.",
      },
      {
        question: "What is the visit like for Gymea clients?",
        answer:
          "It is appointment only and one-on-one with Jena, for colour, blonding, smoothing and cuts. It is a quieter room than a shopping-centre salon.",
      },
      {
        question: "Are Saturday and evening times available from Gymea?",
        answer:
          "Saturday is 8am to 2pm. Wednesday is 4pm to 9pm and Thursday is 9am to 9pm. Sunday and Monday are closed.",
      },
    ],
  },
};
