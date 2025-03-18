CREATE TABLE "company" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"description" text,
	"email" text,
	"password" text,
	CONSTRAINT "User with this email already exists." UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "positions" ADD COLUMN "companyId" uuid;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_companyId_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;