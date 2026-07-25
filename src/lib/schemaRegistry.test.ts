import { describe, expect, it } from "vitest";
import { ENTITY_REGISTRY } from "@/config/entityRegistry";
import {
  generateArticleSchema,
  generateAuthorSchema,
  generateBlogPostSchema,
  generateJenaPersonSchema,
  generateLocalBusinessSchema,
  generateOrganizationSchema,
  generatePlaceSchema,
  generateStoreSchema,
  generateWebSiteSchema,
} from "./schema";

const ARTICLE_FIXTURE = {
  title: "Hair advice",
  description: "Grounded hair advice from Jena.",
  author: "Jena Pinn",
  datePublished: "2026-07-25",
  image: "https://hairpinns.com/og-default.jpg",
  url: "https://hairpinns.com/blog/hair-advice/",
};

describe("canonical schema graph", () => {
  it("assigns the canonical ID to every first-party entity generator", () => {
    expect(generateOrganizationSchema()["@id"]).toBe(
      ENTITY_REGISTRY.ids.organization,
    );
    expect(generateLocalBusinessSchema()["@id"]).toBe(
      ENTITY_REGISTRY.ids.hairSalon,
    );
    expect(generateStoreSchema()["@id"]).toBe(ENTITY_REGISTRY.ids.store);
    expect(generateWebSiteSchema()["@id"]).toBe(
      ENTITY_REGISTRY.ids.webSite,
    );
    expect(generateJenaPersonSchema()["@id"]).toBe(
      ENTITY_REGISTRY.ids.jena,
    );
    expect(generateAuthorSchema()["@id"]).toBe(ENTITY_REGISTRY.ids.jena);
    expect(generatePlaceSchema()["@id"]).toBe(ENTITY_REGISTRY.ids.place);
  });

  it("keeps the salon URL, NAP, coordinates, hours, and profiles canonical on area renders", () => {
    const schema = generateLocalBusinessSchema(
      "https://hairpinns.com/areas/menai-2234/",
    );

    expect(schema.url).toBe(ENTITY_REGISTRY.site.url);
    expect(schema.mainEntityOfPage).toBe(
      "https://hairpinns.com/areas/menai-2234/",
    );
    expect(schema.name).toBe(ENTITY_REGISTRY.business.name);
    expect(schema.telephone).toBe(ENTITY_REGISTRY.contact.phone.raw);
    expect(schema.address).toMatchObject({
      streetAddress: ENTITY_REGISTRY.contact.address.street,
      addressLocality: ENTITY_REGISTRY.contact.address.locality,
      addressRegion: ENTITY_REGISTRY.contact.address.region,
      postalCode: ENTITY_REGISTRY.contact.address.postcode,
    });
    expect(schema.geo).toMatchObject({
      latitude: ENTITY_REGISTRY.place.geo.latitude,
      longitude: ENTITY_REGISTRY.place.geo.longitude,
    });
    expect(schema.openingHoursSpecification).toHaveLength(
      ENTITY_REGISTRY.hours.weekly.length,
    );
    expect(schema.sameAs).toEqual([
      ENTITY_REGISTRY.profiles.google.profileUrl,
      ENTITY_REGISTRY.profiles.fresha.venueUrl,
      ENTITY_REGISTRY.profiles.instagram,
      ENTITY_REGISTRY.profiles.facebook,
      ENTITY_REGISTRY.profiles.sustainableSalons,
    ]);
  });

  it.each([generateBlogPostSchema, generateArticleSchema])(
    "references canonical author and publisher IDs",
    (generateSchema) => {
      const schema = generateSchema(ARTICLE_FIXTURE);
      expect(schema.author).toMatchObject({
        "@type": "Person",
        "@id": ENTITY_REGISTRY.ids.jena,
        name: ENTITY_REGISTRY.person.name,
      });
      expect(schema.publisher).toMatchObject({
        "@type": "Organization",
        "@id": ENTITY_REGISTRY.ids.organization,
        name: ENTITY_REGISTRY.business.name,
      });
    },
  );
});
