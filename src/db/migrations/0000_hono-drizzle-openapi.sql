CREATE TABLE "todos" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"title" varchar(255) NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
