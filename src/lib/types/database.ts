export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Business = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  website: string | null;
  phone: string | null;
  address_json: Json | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
};

export type Asset = {
  id: string;
  business_id: string;
  file_path: string;
  mime_type: string;
  sha256: string | null;
  ocr_text: string | null;
  meta: Json | null;
  created_at: string;
};

export type PublicPage = {
  id: string;
  business_id: string;
  url: string;
  html_render: string;
  jsonld: Json;
  last_published_at: string;
};

export type IndexEvent = {
  id: string;
  business_id: string | null;
  url: string;
  event_type: string;
  status: number | null;
  response: Json | null;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      majed_businesses: {
        Row: Business;
        Insert: Partial<Omit<Business, "id" | "created_at" | "updated_at">> & {
          slug: string;
          name: string;
        };
        Update: Partial<Business>;
      };
      majed_assets: {
        Row: Asset;
        Insert: Partial<Omit<Asset, "id" | "created_at">> & {
          business_id: string;
          file_path: string;
          mime_type: string;
        };
        Update: Partial<Asset>;
      };
      majed_public_pages: {
        Row: PublicPage;
        Insert: Partial<Omit<PublicPage, "id" | "last_published_at">> & {
          business_id: string;
          url: string;
          html_render: string;
          jsonld: Json;
        };
        Update: Partial<PublicPage>;
      };
      majed_index_events: {
        Row: IndexEvent;
        Insert: Partial<Omit<IndexEvent, "id" | "created_at">> & {
          url: string;
          event_type: string;
        };
        Update: Partial<IndexEvent>;
      };
    };
  };
}

