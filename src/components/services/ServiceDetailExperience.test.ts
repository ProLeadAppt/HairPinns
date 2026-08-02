import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BOOK_CTA_LABEL } from "../../config/bookingConfig";
import { serviceDetailData } from "../../data/serviceDetails";
import ServiceDetailExperience from "./ServiceDetailExperience";

afterEach(() => {
  vi.useRealTimers();
});

describe("ServiceDetailExperience review proof", () => {
  it("renders venue-level Fresha proof without replacing the booking action", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-26T12:00:00Z"));

    const categoryData = serviceDetailData.find((category) => category.slug === "smoothing");
    const serviceData = categoryData?.services.find(
      (service) => service.slug === "mid-length-straight-up-smoothing",
    );
    expect(categoryData).toBeDefined();
    expect(serviceData).toBeDefined();

    const html = renderToStaticMarkup(
      createElement(
        StaticRouter,
        { location: "/services/smoothing/mid-length-straight-up-smoothing" },
        createElement(ServiceDetailExperience, {
          categoryData: categoryData!,
          serviceData: serviceData!,
          categorySlug: categoryData!.slug,
          serviceSlug: serviceData!.slug,
          topics: [],
        }),
      ),
    );

    expect(html).toContain('data-review-proof-source="fresha"');
    expect(html).toContain("Hair Pinns venue on Fresha: 5.0 from 936 reviews");
    expect(html).toContain(BOOK_CTA_LABEL);
  });
});
