import { HttpRequest } from "@azure/functions";
import { createRemoteJWKSet, jwtVerify, JWTPayload } from "jose";

export type CustomerIdentity = { id: string; email: string; name: string; phone?: string; admin: boolean };

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

export async function authenticate(request: HttpRequest): Promise<CustomerIdentity> {
  const header = request.headers.get("x-golden-bloom-authorization");
  const token = /^Bearer\s+(.+)$/i.exec(header || "")?.[1]?.trim();
  if (!token) throw new Error("UNAUTHORIZED");

  const tenantName = process.env.AZURE_TENANT_NAME;
  const tenantId = process.env.AZURE_TENANT_ID;
  const apiClientId = process.env.AZURE_API_CLIENT_ID;
  if (!tenantName || !tenantId || !apiClientId) throw new Error("SERVER_NOT_CONFIGURED");

  const issuer = `https://${tenantId}.ciamlogin.com/${tenantId}/v2.0`;
  jwks ||= createRemoteJWKSet(new URL(`https://${tenantName}.ciamlogin.com/${tenantName}.onmicrosoft.com/discovery/v2.0/keys`));
  const verified = await jwtVerify(token, jwks, { issuer, audience: apiClientId });
  return identityFromClaims(verified.payload);
}

function identityFromClaims(claims: JWTPayload): CustomerIdentity {
  const emails = Array.isArray(claims.emails) ? claims.emails : [];
  const email = String(claims.email || claims.preferred_username || emails[0] || "").toLowerCase();
  const id = String(claims.oid || claims.sub || "");
  if (!id || !email) throw new Error("UNAUTHORIZED");
  const admins = (process.env.ADMIN_EMAILS || "").toLowerCase().split(",").map(v => v.trim()).filter(Boolean);
  const customPhone=Object.entries(claims).find(([key,value])=>/phone/i.test(key)&&typeof value==="string")?.[1];
  const phone=String(claims.phone_number||customPhone||"").trim()||undefined;
  return { id, email, name: String(claims.name || email.split("@")[0]), phone, admin: admins.includes(email) };
}
