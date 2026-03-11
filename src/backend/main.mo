import AccessControl "./authorization/access-control";
import Prim "mo:prim";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";

persistent actor {
  // === Authorization ===
  transient let accessControlState : AccessControl.AccessControlState = AccessControl.initState();

  public shared ({ caller }) func _initializeAccessControlWithSecret(userSecret : Text) : async () {
    switch (Prim.envVar<system>("CAFFEINE_ADMIN_TOKEN")) {
      case (null) { Runtime.trap("CAFFEINE_ADMIN_TOKEN not set") };
      case (?adminToken) {
        AccessControl.initialize(accessControlState, caller, adminToken, userSecret);
      };
    };
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // === Data Types ===
  public type VideoEntry = {
    id : Nat;
    title : Text;
    artist : Text;
    category : Text;
    youtubeUrl : Text;
    thumbnailUrl : Text;
    dateAdded : Nat64;
  };

  // === State ===
  transient var videos : [VideoEntry] = [];
  transient var nextId : Nat = 0;

  // === Helper: extract YouTube video ID from URL ===
  func extractVideoId(url : Text) : Text {
    let chars = url.chars().toArray();
    let n = chars.size();
    var i = 0;
    // Handle ?v= or &v=
    while (i + 3 <= n) {
      if ((chars[i] == '?' or chars[i] == '&') and chars[i+1] == 'v' and chars[i+2] == '=') {
        var vid = "";
        var j = i + 3;
        while (j < n) {
          let c = chars[j];
          if (c == '&' or c == '#') { j := n }
          else { vid := vid # Text.fromChar(c); j += 1 };
        };
        if (vid.size() > 0) return vid;
      };
      i += 1;
    };
    // Handle youtu.be/VIDEO_ID
    let prefix = "youtu.be/";
    let prefixChars = prefix.chars().toArray();
    let pn = prefixChars.size();
    i := 0;
    while (i + pn <= n) {
      var match_ = true;
      var k = 0;
      while (k < pn) {
        if (chars[i + k] != prefixChars[k]) { match_ := false };
        k += 1;
      };
      if (match_) {
        var vid = "";
        var j = i + pn;
        while (j < n) {
          let c = chars[j];
          if (c == '?' or c == '&' or c == '#') { j := n }
          else { vid := vid # Text.fromChar(c); j += 1 };
        };
        if (vid.size() > 0) return vid;
      };
      i += 1;
    };
    "";
  };

  func makeThumbnail(videoId : Text) : Text {
    "https://img.youtube.com/vi/" # videoId # "/hqdefault.jpg";
  };

  // === Seed Data ===
  func seedVideos() {
    type SeedEntry = (Text, Text, Text, Text);
    let seed : [SeedEntry] = [
      ("Take On Me", "a-ha", "80's Music", "https://www.youtube.com/watch?v=djV11Xbc914"),
      ("Don't You (Forget About Me)", "Simple Minds", "80's Music", "https://www.youtube.com/watch?v=CdqoNKCCt7A"),
      ("Smells Like Teen Spirit", "Nirvana", "90's Music", "https://www.youtube.com/watch?v=hTWKbfoikeg"),
      ("Wannabe", "Spice Girls", "90's Music", "https://www.youtube.com/watch?v=gJLIiF15wjQ"),
      ("Master of Puppets", "Metallica", "Heavy Metal", "https://www.youtube.com/watch?v=xkNOtRLFTZ4"),
      ("Paranoid", "Black Sabbath", "Heavy Metal", "https://www.youtube.com/watch?v=0qanF-91aJo"),
      ("Bohemian Rhapsody", "Queen", "Rock", "https://www.youtube.com/watch?v=fJ9rUzIMcZQ"),
      ("Hotel California", "Eagles", "Rock", "https://www.youtube.com/watch?v=BciS5krYL80"),
      ("Stairway to Heaven", "Led Zeppelin", "Classic Rock", "https://www.youtube.com/watch?v=QkF3oxziUI4"),
      ("Sweet Child O' Mine", "Guns N' Roses", "Classic Rock", "https://www.youtube.com/watch?v=1w7OgIMMRc4"),
      ("Thriller", "Michael Jackson", "Pop", "https://www.youtube.com/watch?v=sOnqjkJTMaA"),
      ("Shape of You", "Ed Sheeran", "Pop", "https://www.youtube.com/watch?v=JGwWNGJdvx8"),
      ("Lose Yourself", "Eminem", "Hip Hop / Rap", "https://www.youtube.com/watch?v=_Yhyp-_hX2s"),
      ("HUMBLE.", "Kendrick Lamar", "Hip Hop / Rap", "https://www.youtube.com/watch?v=tvTRZJ-4EyI"),
      ("I Will Always Love You", "Whitney Houston", "R&B / Soul", "https://www.youtube.com/watch?v=3JWTaaS7LdU"),
      ("Superstition", "Stevie Wonder", "R&B / Soul", "https://www.youtube.com/watch?v=0CFuCYNx-1g"),
      ("So What", "Miles Davis", "Jazz", "https://www.youtube.com/watch?v=zqNTltOGh5c"),
      ("The Thrill Is Gone", "B.B. King", "Blues", "https://www.youtube.com/watch?v=oica5jG7FpU"),
      ("One More Time", "Daft Punk", "Electronic / Dance", "https://www.youtube.com/watch?v=FGBhQbmPwH8"),
      ("Friends in Low Places", "Garth Brooks", "Country", "https://www.youtube.com/watch?v=4SXcNgNH_eQ"),
    ];
    var idx = 0;
    var ts : Nat64 = 1700000000000000000;
    videos := seed.map(func(entry : SeedEntry) : VideoEntry {
      let (title, artist, category, url) = entry;
      let videoId = extractVideoId(url);
      let v : VideoEntry = {
        id = idx;
        title = title;
        artist = artist;
        category = category;
        youtubeUrl = url;
        thumbnailUrl = makeThumbnail(videoId);
        dateAdded = ts;
      };
      idx += 1;
      ts += 1000000000;
      v;
    });
    nextId := idx;
  };

  seedVideos();

  func compareByDate(a : VideoEntry, b : VideoEntry) : { #less; #equal; #greater } {
    if (a.dateAdded > b.dateAdded) #less
    else if (a.dateAdded < b.dateAdded) #greater
    else #equal;
  };

  // === Public Queries ===
  public query func getAllVideos() : async [VideoEntry] {
    videos.sort(compareByDate);
  };

  public query func getFeaturedVideos() : async [VideoEntry] {
    let sorted = videos.sort(compareByDate);
    let count = if (sorted.size() <= 8) sorted.size() else 8;
    sorted.sliceToArray(0, count);
  };

  public query func getVideosByCategory(cat : Text) : async [VideoEntry] {
    let lower = cat.toLower();
    videos.filter(func(v : VideoEntry) : Bool { v.category.toLower() == lower });
  };

  public query func getVideosByArtist(art : Text) : async [VideoEntry] {
    let lower = art.toLower();
    videos.filter(func(v : VideoEntry) : Bool { v.artist.toLower() == lower });
  };

  public query func searchVideos(q : Text) : async [VideoEntry] {
    let lower = q.toLower();
    videos.filter(func(v : VideoEntry) : Bool {
      v.title.toLower().contains(#text lower) or
      v.artist.toLower().contains(#text lower) or
      v.category.toLower().contains(#text lower);
    });
  };

  public query func getAllCategories() : async [Text] {
    var seen : [Text] = [];
    for (v in videos.vals()) {
      switch (seen.find(func(c : Text) : Bool { c == v.category })) {
        case null { seen := seen.concat([v.category]) };
        case _ {};
      };
    };
    seen;
  };

  public query func getAllArtists() : async [Text] {
    var seen : [Text] = [];
    for (v in videos.vals()) {
      switch (seen.find(func(a : Text) : Bool { a == v.artist })) {
        case null { seen := seen.concat([v.artist]) };
        case _ {};
      };
    };
    seen;
  };

  // === Admin Mutations ===
  public shared ({ caller }) func addVideo(title : Text, artist : Text, category : Text, youtubeUrl : Text) : async VideoEntry {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    let videoId = extractVideoId(youtubeUrl);
    let entry : VideoEntry = {
      id = nextId;
      title = title;
      artist = artist;
      category = category;
      youtubeUrl = youtubeUrl;
      thumbnailUrl = makeThumbnail(videoId);
      dateAdded = Prim.time();
    };
    videos := videos.concat([entry]);
    nextId += 1;
    entry;
  };

  public shared ({ caller }) func updateVideo(id : Nat, title : Text, artist : Text, category : Text, youtubeUrl : Text) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    let videoId = extractVideoId(youtubeUrl);
    var found = false;
    videos := videos.map(func(v : VideoEntry) : VideoEntry {
      if (v.id == id) {
        found := true;
        { id = v.id; title = title; artist = artist; category = category; youtubeUrl = youtubeUrl; thumbnailUrl = makeThumbnail(videoId); dateAdded = v.dateAdded };
      } else v;
    });
    found;
  };

  public shared ({ caller }) func deleteVideo(id : Nat) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    let before = videos.size();
    videos := videos.filter(func(v : VideoEntry) : Bool { v.id != id });
    videos.size() < before;
  };
}
