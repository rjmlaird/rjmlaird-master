// Types based on your API contracts
export interface CertificationItem {
  id: string;
  name: string;
  cdnId: string;
  issuer: string;
  type: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string | string[];
  year: number;
  type: string;
  event?: string;
  session_title?: string;
  summary?: string;
  keywords?: string[];
  value?: string;
}

export interface VolunteeringItem {
  id: string;
  organisation: string;
  role: string;
  startDate: string;
  endDate?: string;
  city?: string;
  country?: string;
  summary?: string;
}

// 1. Certifications Mapper
export function mapCertificationsToSchema(personName: string, items: CertificationItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": personName,
    "hasCredential": items.map((cert) => ({
      "@type": "EducationalOccupationalCredential",
      "@id": cert.id,
      "name": cert.name,
      "credentialCategory": cert.type,
      "identifier": cert.cdnId,
      "offeredBy": {
        "@type": cert.issuer.includes("University") ? "EducationalOrganization" : "Organization",
        "name": cert.issuer,
      },
    })),
  };
}

// 2. Awards & Grants Mapper
export function mapAwardsToSchema(personName: string, items: AwardItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": personName,
    "award": items.map((item) => {
      const isGrantOrScholarship = ["grant", "scholarship", "fellowship"].includes(item.type.toLowerCase());
      
      if (isGrantOrScholarship) {
        return {
          "@type": "Grant",
          "@id": item.id,
          "name": item.title,
          "description": item.summary || item.event || undefined,
          "sponsor": Array.isArray(item.issuer)
            ? item.issuer.map((iss) => ({ "@type": "Organization", "name": iss }))
            : { "@type": "Organization", "name": item.issuer },
          ...(item.value ? {
            "amount": {
              "@type": "MonetaryAmount",
              "currency": item.value.startsWith("€") ? "EUR" : "GBP",
              "value": item.value.replace(/[^0-9]/g, "")
            }
          } : {}),
          "keywords": item.keywords,
        };
      }

      return {
        "@type": "Award",
        "@id": item.id,
        "name": item.session_title ? `${item.title}: ${item.session_title}` : item.title,
        "dateCreated": item.year.toString(),
        "author": Array.isArray(item.issuer)
          ? item.issuer.map((iss) => ({ "@type": "Organization", "name": iss }))
          : { "@type": "Organization", "name": item.issuer },
        "keywords": item.keywords,
      };
    }),
  };
}

// 3. Volunteering Mapper
export function mapVolunteeringToSchema(personName: string, items: VolunteeringItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": personName,
    "memberOf": items.map((item) => ({
      "@type": "OrganizationRole",
      "@id": item.id,
      "roleName": item.role,
      "startDate": item.startDate,
      ...(item.endDate ? { "endDate": item.endDate } : {}),
      "memberOf": {
        "@type": "Organization",
        "name": item.organisation,
        ...(item.city || item.country ? {
          "location": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": item.city || undefined,
              "addressCountry": item.country || undefined,
            }
          }
        } : {})
      }
    }))
  };
}