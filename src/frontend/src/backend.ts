import { Actor } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import type { Principal } from "@dfinity/principal";

export type VideoEntry = {
  id: bigint;
  title: string;
  artist: string;
  category: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  dateAdded: bigint;
};

export interface backendInterface {
  _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
  getCallerUserRole(): Promise<{ admin: null } | { user: null } | { guest: null }>;
  isCallerAdmin(): Promise<boolean>;
  assignCallerUserRole(
    user: Principal,
    role: { admin: null } | { user: null } | { guest: null },
  ): Promise<void>;
  getAllVideos(): Promise<VideoEntry[]>;
  getFeaturedVideos(): Promise<VideoEntry[]>;
  getVideosByCategory(category: string): Promise<VideoEntry[]>;
  getVideosByArtist(artist: string): Promise<VideoEntry[]>;
  searchVideos(query: string): Promise<VideoEntry[]>;
  getAllCategories(): Promise<string[]>;
  getAllArtists(): Promise<string[]>;
  addVideo(
    title: string,
    artist: string,
    category: string,
    youtubeUrl: string,
  ): Promise<VideoEntry>;
  updateVideo(
    id: bigint,
    title: string,
    artist: string,
    category: string,
    youtubeUrl: string,
  ): Promise<boolean>;
  deleteVideo(id: bigint): Promise<boolean>;
}

export type CreateActorOptions = {
  agentOptions?: Record<string, unknown>;
  agent?: unknown;
  processError?: (e: unknown) => never;
};

export class ExternalBlob {
  private _bytes?: Uint8Array;
  private _url?: string;
  public onProgress?: (progress: number) => void;

  constructor(bytes?: Uint8Array, url?: string) {
    this._bytes = bytes;
    this._url = url;
  }

  async getBytes(): Promise<Uint8Array> {
    if (this._bytes) return this._bytes;
    if (this._url) {
      const response = await fetch(this._url);
      const buffer = await response.arrayBuffer();
      return new Uint8Array(buffer);
    }
    return new Uint8Array();
  }

  static fromURL(url: string): ExternalBlob {
    return new ExternalBlob(undefined, url);
  }
}

const idlFactory = ({ IDL: I }: { IDL: typeof IDL }) => {
  const VideoEntry = I.Record({
    id: I.Nat,
    title: I.Text,
    artist: I.Text,
    category: I.Text,
    youtubeUrl: I.Text,
    thumbnailUrl: I.Text,
    dateAdded: I.Nat,
  });
  const Role = I.Variant({
    admin: I.Null,
    user: I.Null,
    guest: I.Null,
  });
  return I.Service({
    _initializeAccessControlWithSecret: I.Func([I.Text], [], []),
    getCallerUserRole: I.Func([], [Role], ["query"]),
    isCallerAdmin: I.Func([], [I.Bool], ["query"]),
    assignCallerUserRole: I.Func([I.Principal, Role], [], []),
    getAllVideos: I.Func([], [I.Vec(VideoEntry)], ["query"]),
    getFeaturedVideos: I.Func([], [I.Vec(VideoEntry)], ["query"]),
    getVideosByCategory: I.Func([I.Text], [I.Vec(VideoEntry)], ["query"]),
    getVideosByArtist: I.Func([I.Text], [I.Vec(VideoEntry)], ["query"]),
    searchVideos: I.Func([I.Text], [I.Vec(VideoEntry)], ["query"]),
    getAllCategories: I.Func([], [I.Vec(I.Text)], ["query"]),
    getAllArtists: I.Func([], [I.Vec(I.Text)], ["query"]),
    addVideo: I.Func([I.Text, I.Text, I.Text, I.Text], [VideoEntry], []),
    updateVideo: I.Func([I.Nat, I.Text, I.Text, I.Text, I.Text], [I.Bool], []),
    deleteVideo: I.Func([I.Nat], [I.Bool], []),
  });
};

export function createActor(
  canisterId: string,
  _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  _downloadFile: (bytes: Uint8Array) => Promise<ExternalBlob>,
  options?: CreateActorOptions,
): backendInterface {
  const agent = options?.agent;
  return Actor.createActor(idlFactory as any, {
    agent: agent as any,
    canisterId,
  }) as unknown as backendInterface;
}
