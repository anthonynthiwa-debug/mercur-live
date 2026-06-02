import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class LiveShoppingMigration extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table if not exists "live_stream" ("id" text not null, "seller_id" text not null, "title" text not null, "description" text null, "scheduled_at" timestamptz null, "started_at" timestamptz null, "ended_at" timestamptz null, "status" text check ("status" in ('scheduled', 'live', 'paused', 'ended')) not null default 'scheduled', "channel_name" text not null, "recording_id" text null, "vod_url" text null, "co_host_ids" jsonb null, "settings" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "live_stream_pkey" primary key ("id"));`);
    this.addSql(`create unique index if not exists "IDX_live_stream_channel_name_unique" on "live_stream" ("channel_name") where deleted_at is null;`);
    this.addSql(`create index if not exists "IDX_live_stream_seller_id" on "live_stream" ("seller_id") where deleted_at is null;`);

    this.addSql(`create table if not exists "live_stream_product_pin" ("id" text not null, "stream_id" text not null, "product_id" text not null, "variant_id" text not null, "pinned_at" timestamptz not null, "unpinned_at" timestamptz null, "is_flash_deal" boolean not null default false, "flash_deal_price" numeric null, "flash_deal_quantity" int null, "flash_deal_ends_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "live_stream_product_pin_pkey" primary key ("id"));`);
    this.addSql(`create index if not exists "IDX_live_stream_product_pin_stream_id" on "live_stream_product_pin" ("stream_id") where deleted_at is null;`);
    this.addSql(`create index if not exists "IDX_live_stream_product_pin_product_id" on "live_stream_product_pin" ("product_id") where deleted_at is null;`);

    this.addSql(`create table if not exists "live_stream_viewer" ("id" text not null, "stream_id" text not null, "customer_id" text null, "join_at" timestamptz not null, "leave_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "live_stream_viewer_pkey" primary key ("id"));`);
    this.addSql(`create index if not exists "IDX_live_stream_viewer_stream_id" on "live_stream_viewer" ("stream_id") where deleted_at is null;`);

    this.addSql(`create table if not exists "live_stream_message" ("id" text not null, "stream_id" text not null, "customer_id" text null, "seller_id" text null, "message" text not null, "timestamp" timestamptz not null, "is_deleted" boolean not null default false, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "live_stream_message_pkey" primary key ("id"));`);
    this.addSql(`create index if not exists "IDX_live_stream_message_stream_id" on "live_stream_message" ("stream_id") where deleted_at is null;`);

    this.addSql(`create table if not exists "seller_push_subscription" ("id" text not null, "seller_id" text not null, "customer_id" text not null, "subscription" jsonb not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "seller_push_subscription_pkey" primary key ("id"));`);
    this.addSql(`create index if not exists "IDX_seller_push_subscription_seller_id" on "seller_push_subscription" ("seller_id") where deleted_at is null;`);
    this.addSql(`create index if not exists "IDX_seller_push_subscription_customer_id" on "seller_push_subscription" ("customer_id") where deleted_at is null;`);

    this.addSql(`create table if not exists "live_stream_analytics_daily" ("id" text not null, "stream_id" text not null, "date" date not null, "peak_viewers" int not null default 0, "total_views" int not null default 0, "total_messages" int not null default 0, "total_revenue" numeric not null default 0, "total_orders" int not null default 0, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "live_stream_analytics_daily_pkey" primary key ("id"));`);
    this.addSql(`create index if not exists "IDX_live_stream_analytics_daily_stream_id" on "live_stream_analytics_daily" ("stream_id") where deleted_at is null;`);

    this.addSql(`alter table "live_stream_product_pin" add constraint "live_stream_product_pin_stream_id_foreign" foreign key ("stream_id") references "live_stream" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "live_stream_viewer" add constraint "live_stream_viewer_stream_id_foreign" foreign key ("stream_id") references "live_stream" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "live_stream_message" add constraint "live_stream_message_stream_id_foreign" foreign key ("stream_id") references "live_stream" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "live_stream_analytics_daily" cascade;`);
    this.addSql(`drop table if exists "seller_push_subscription" cascade;`);
    this.addSql(`drop table if exists "live_stream_message" cascade;`);
    this.addSql(`drop table if exists "live_stream_viewer" cascade;`);
    this.addSql(`drop table if exists "live_stream_product_pin" cascade;`);
    this.addSql(`drop table if exists "live_stream" cascade;`);
  }
}
