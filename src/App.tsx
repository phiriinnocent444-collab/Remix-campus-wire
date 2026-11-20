import React, { useState, useEffect } from 'react';
import {
  AppTab,
  CampusGiftItem,
  CampusMention,
  CampusPoll,
  ChatConversation,
  CurrentUser,
  EmojiReactionType,
  GossipPost,
  PostCategory,
  StudentProfile,
  UniversityId,
  MarketplaceProduct,
  CartItem,
  MarketplaceOrder,
} from './types';
import {
  CAMPUS_POLLS,
  CURRENT_USER,
  INITIAL_CONVERSATIONS,
  INITIAL_POSTS,
  STUDENT_PROFILES,
  UNIVERSITIES,
} from './data/mockData';
import { INITIAL_PRODUCTS } from './data/marketplaceData';
import { filterPosts, isSecretCrushMutual } from './utils/rules';
import { extractMentions, INITIAL_MENTIONS } from './utils/mentions';
import { Navbar } from './components/Navbar';
import { UniversityFilterBar } from './components/UniversityFilterBar';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { GossipFeed } from './components/GossipFeed';
import { PostComposerModal } from './components/PostComposerModal';
import { PostDetailModal } from './components/PostDetailModal';
import { CampusCrushEncounter } from './components/CampusCrushEncounter';
import { SecretCrushModal } from './components/SecretCrushModal';
import { GiftsModal } from './components/GiftsModal';
import { CampusPolls } from './components/CampusPolls';
import { DirectMessages } from './components/DirectMessages';
import { StudentProfileModal } from './components/StudentProfileModal';
import { SafetyGuidelinesModal } from './components/SafetyGuidelinesModal';
import { StudentQrModal } from './components/StudentQrModal';
import { CampusGoogleMap } from './components/CampusGoogleMap';
import { CampusEventCalendar } from './components/CampusEventCalendar';
import { LiveEnvironmentalBackground } from './components/LiveEnvironmentalBackground';
import { AuthModal } from './components/AuthModal';
import { MentionsFeed } from './components/MentionsFeed';
import { Sidebar } from './components/Sidebar';
import { UniversityLogo } from './components/UniversityLogo';
import { CampusMarketplace } from './components/CampusMarketplace';
import { ProductDetailModal as MarketplaceProductModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SellProductModal } from './components/SellProductModal';
import { CornVideo } from './types/cornhub';
import { INITIAL_CORN_VIDEOS } from './data/cornhubData';
import { CornHubPortal } from './components/cornhub/CornHubPortal';
import { CornVideoModal } from './components/cornhub/CornVideoModal';
import { CornWatchPage } from './components/cornhub/CornWatchPage';
import { StudentVideo } from './types/studentVideo';
import { INITIAL_STUDENT_VIDEOS } from './data/studentVideoData';
import { ZedWhisperVideoPortal } from './components/video/ZedWhisperVideoPortal';
import { StudentVideoModal } from './components/video/StudentVideoModal';
import { StudentWatchPage } from './components/video/StudentWatchPage';
import { FullstackDevStudio } from './components/devlab/FullstackDevStudio';
import {
  fetchBackendPosts,
  createBackendPost,
  voteBackendPost,
  addBackendComment,
  fetchCurrentAuthUser,
  AuthStudent,
} from './lib/fullstackApi';
import {
  supabase,
  checkSupabaseHealth,
  fetchSupabasePosts,
  fetchSupabaseComments,
  createSupabasePost,
  voteSupabasePost,
  addSupabaseComment,
  sendSupabaseDirectMessage,
  submitSupabaseReport,
  getLiveBroadcastChannel,
  broadcastNewPost,
  broadcastPostVote,
  broadcastNewComment,
  broadcastDirectMessage,
  SupabaseHealth,
} from './lib/supabase';
import {
  Flame,
  ShieldCheck,
  Heart,
  Sparkles,
  Check,
  Bell,
  Bookmark,
  MessageSquare,
  AtSign,
  ChevronRight,
  Home,
  Compass,
  Calendar,
  X,
  Plus,
  BarChart3,
  HelpCircle,
} from 'lucide-react';
import { CAMPUS_EVENTS } from './data/campusLocationsAndEvents';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<AppTab>('feed');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // University & Category Filter States
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityId>('all');
  const currentUni = UNIVERSITIES.find((u) => u.id === selectedUniversity) || UNIVERSITIES[0];
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'latest' | 'discussed'>('trending');

  // Application Data States
  const [posts, setPosts] = useState<GossipPost[]>(() => {
    const saved = localStorage.getItem('zedwhisper_posts');
    if (saved) {
      try {
        const parsed: GossipPost[] = JSON.parse(saved);
        // Only keep genuine posts submitted during this or previous live sessions,
        // purging any legacy mock demo IDs so the postings board starts completely blank
        return parsed.filter(
          (p) =>
            !p.id.startsWith('post-seed-') &&
            !p.id.startsWith('post-sports-') &&
            !p.id.startsWith('post-event-') &&
            !p.id.startsWith('post-lost-') &&
            !p.id.startsWith('post-nipa-') &&
            !['post-1', 'post-2', 'post-3', 'post-4', 'post-5', 'post-6', 'post-7', 'post-8'].includes(p.id)
        );
      } catch {
        return [];
      }
    }
    return INITIAL_POSTS;
  });


  const [profiles, setProfiles] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('zedwhisper_profiles');
    return saved ? JSON.parse(saved) : STUDENT_PROFILES;
  });

  const [polls, setPolls] = useState<CampusPoll[]>(() => {
    const saved = localStorage.getItem('zedwhisper_polls');
    if (saved) {
      try {
        const parsed: CampusPoll[] = JSON.parse(saved);
        return parsed.filter((p) => !['poll-1', 'poll-2', 'poll-3'].includes(p.id));
      } catch {
        return [];
      }
    }
    return CAMPUS_POLLS;
  });

  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    const saved = localStorage.getItem('zedwhisper_convs');
    if (saved) {
      try {
        const parsed: ChatConversation[] = JSON.parse(saved);
        return parsed.filter((c) => !['conv-1', 'conv-2'].includes(c.id));
      } catch {
        return [];
      }
    }
    return INITIAL_CONVERSATIONS;
  });

  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    const saved = localStorage.getItem('zedwhisper_user');
    if (saved) {
      try {
        const parsed: CurrentUser = JSON.parse(saved);
        return {
          ...parsed,
          bookmarkedPostIds: (parsed.bookmarkedPostIds || []).filter((id) => !['post-1', 'post-3'].includes(id)),
        };
      } catch {
        return CURRENT_USER;
      }
    }
    return CURRENT_USER;
  });


  // Modals & Panels State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<GossipPost | null>(null);
  const [isGiftsModalOpen, setIsGiftsModalOpen] = useState(false);
  const [targetProfileForGift, setTargetProfileForGift] = useState<StudentProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isGmpQuotaExceeded, setIsGmpQuotaExceeded] = useState(false);
  const [presetVenue, setPresetVenue] = useState<{ name: string; university: UniversityId } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Peer Mentions & Notifications State
  const [mentions, setMentions] = useState<CampusMention[]>(() => {
    try {
      const saved = localStorage.getItem('zedwhisper_mentions');
      return saved ? JSON.parse(saved) : INITIAL_MENTIONS;
    } catch {
      return INITIAL_MENTIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('zedwhisper_mentions', JSON.stringify(mentions));
    } catch {}
  }, [mentions]);

  const unreadMentionsCount = mentions.filter((m) => !m.isRead).length;

  const handleToggleReaction = (
    postId: string,
    commentId: string | undefined,
    reactionType: EmojiReactionType
  ) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        if (!commentId) {
          const userReactions = p.userReactions || [];
          const hasReacted = userReactions.includes(reactionType);
          const newUserReactions = hasReacted
            ? userReactions.filter((r) => r !== reactionType)
            : [...userReactions, reactionType];
          const reactions = { ...(p.reactions || {}) };
          const currentCount = reactions[reactionType] || 0;
          reactions[reactionType] = Math.max(0, currentCount + (hasReacted ? -1 : 1));
          return { ...p, reactions, userReactions: newUserReactions };
        } else {
          const updatedComments = p.comments.map((c) => {
            if (c.id !== commentId) return c;
            const userReactions = c.userReactions || [];
            const hasReacted = userReactions.includes(reactionType);
            const newUserReactions = hasReacted
              ? userReactions.filter((r) => r !== reactionType)
              : [...userReactions, reactionType];
            const reactions = { ...(c.reactions || {}) };
            const currentCount = reactions[reactionType] || 0;
            reactions[reactionType] = Math.max(0, currentCount + (hasReacted ? -1 : 1));
            return { ...c, reactions, userReactions: newUserReactions };
          });
          return { ...p, comments: updatedComments };
        }
      })
    );
  };

  const handleAuthSuccess = (authUser: AuthStudent) => {
    setIsLoggedIn(true);
    setCurrentUser((prev) => ({
      ...prev,
      id: authUser.id,
      realName: authUser.realName,
      alias: authUser.alias,
      university: authUser.university,
      program: authUser.program,
      year: authUser.year,
    }));
    showToast(`Welcome @${authUser.alias}! Signed into ${authUser.university.toUpperCase()}.`);
  };

  const [supabaseHealth, setSupabaseHealth] = useState<SupabaseHealth>({
    connected: true,
    tableReady: false,
    url: 'https://rflxrnpmmnkwnfgwldma.supabase.co',
    projectRef: 'rflxrnpmmnkwnfgwldma',
  });

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Marketplace & Student E-Commerce State
  const [marketplaceProducts, setMarketplaceProducts] = useState<MarketplaceProduct[]>(() => {
    try {
      const saved = localStorage.getItem('zedwhisper_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zedwhisper_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<MarketplaceOrder[]>(() => {
    try {
      const saved = localStorage.getItem('zedwhisper_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedMarketplaceProduct, setSelectedMarketplaceProduct] = useState<MarketplaceProduct | null>(null);
  const [appliedCheckoutCoupon, setAppliedCheckoutCoupon] = useState<string | undefined>(undefined);

  useEffect(() => {
    try {
      localStorage.setItem('zedwhisper_products', JSON.stringify(marketplaceProducts));
    } catch {}
  }, [marketplaceProducts]);

  useEffect(() => {
    try {
      localStorage.setItem('zedwhisper_cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('zedwhisper_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  // Cart & Order Handlers
  const handleAddToCart = (product: MarketplaceProduct, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(product.stock, i.quantity + quantity) }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.title.slice(0, 22)}..." to your campus bag`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleProceedToCheckout = (couponCode?: string) => {
    setAppliedCheckoutCoupon(couponCode);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = (order: MarketplaceOrder) => {
    setOrders((prev) => [order, ...prev]);
    // Deduct stock from products
    setMarketplaceProducts((prev) =>
      prev.map((p) => {
        const orderedItem = order.items.find((i) => i.product.id === p.id);
        if (orderedItem) {
          return { ...p, stock: Math.max(0, p.stock - orderedItem.quantity) };
        }
        return p;
      })
    );
    // Clear cart
    setCartItems([]);
    showToast(`Order ${order.orderNumber} successfully registered!`);
  };

  const handleAddProduct = (product: MarketplaceProduct) => {
    setMarketplaceProducts((prev) => [product, ...prev]);
    showToast(`Published "${product.title.slice(0, 22)}..." to campus store!`);
  };

  // CornHub Video Portal State (Legacy Fallback)
  const [cornVideos, setCornVideos] = useState<CornVideo[]>(() => {
    try {
      const saved = localStorage.getItem('zedwhisper_corn_videos');
      return saved ? JSON.parse(saved) : INITIAL_CORN_VIDEOS;
    } catch {
      return INITIAL_CORN_VIDEOS;
    }
  });

  const [selectedCornVideo, setSelectedCornVideo] = useState<CornVideo | null>(null);
  const [activeWatchVideo, setActiveWatchVideo] = useState<CornVideo | null>(null);
  const [isStandaloneCornHub, setIsStandaloneCornHub] = useState(false);

  // ZedWhisper Video Hub (Campus Activities Cinema) State
  const [studentVideos, setStudentVideos] = useState<StudentVideo[]>(() => {
    try {
      const saved = localStorage.getItem('zedwhisper_student_videos');
      return saved ? JSON.parse(saved) : INITIAL_STUDENT_VIDEOS;
    } catch {
      return INITIAL_STUDENT_VIDEOS;
    }
  });

  const [selectedStudentVideo, setSelectedStudentVideo] = useState<StudentVideo | null>(null);
  const [activeWatchStudentVideo, setActiveWatchStudentVideo] = useState<StudentVideo | null>(null);
  const [isStandaloneVideoHub, setIsStandaloneVideoHub] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('zedwhisper_student_videos', JSON.stringify(studentVideos));
    } catch {}
  }, [studentVideos]);

  const handleVoteStudentVideo = (videoId: string, type: 'up' | 'down') => {
    setStudentVideos((prev) =>
      prev.map((v) => {
        if (v.id !== videoId) return v;
        const currentVote = v.userVote;
        let up = v.upvotes;
        let down = v.downvotes;
        if (currentVote === type) {
          return {
            ...v,
            userVote: undefined,
            upvotes: type === 'up' ? up - 1 : up,
            downvotes: type === 'down' ? down - 1 : down,
          };
        }
        if (currentVote === 'up') up--;
        if (currentVote === 'down') down--;
        return {
          ...v,
          userVote: type,
          upvotes: type === 'up' ? up + 1 : up,
          downvotes: type === 'down' ? down + 1 : down,
        };
      })
    );
  };

  const handleAddStudentComment = (videoId: string, commentText: string) => {
    setStudentVideos((prev) =>
      prev.map((v) => {
        if (v.id !== videoId) return v;
        const newComm = {
          id: 'comm-' + Date.now(),
          author: currentUser.alias || 'CampusStudent',
          comment: commentText,
          upvotes: 1,
          timestamp: 'Just now',
          university: currentUni.shortName,
        };
        return {
          ...v,
          comments: [newComm, ...(v.comments || [])],
        };
      })
    );
    showToast('Your comment was posted to ZedWhisper Video Hub!');
  };

  useEffect(() => {
    try {
      localStorage.setItem('zedwhisper_corn_videos', JSON.stringify(cornVideos));
    } catch {}
  }, [cornVideos]);

  const handleVoteCornVideo = (videoId: string, type: 'up' | 'down') => {
    setCornVideos((prev) =>
      prev.map((v) => {
        if (v.id !== videoId) return v;
        const currentVote = v.userVote;
        let up = v.upvotes;
        let down = v.downvotes;
        if (currentVote === type) {
          return {
            ...v,
            userVote: undefined,
            upvotes: type === 'up' ? up - 1 : up,
            downvotes: type === 'down' ? down - 1 : down,
          };
        }
        if (currentVote === 'up') up--;
        if (currentVote === 'down') down--;
        return {
          ...v,
          userVote: type,
          upvotes: type === 'up' ? up + 1 : up,
          downvotes: type === 'down' ? down + 1 : down,
        };
      })
    );
  };

  const handleAddCornComment = (videoId: string, commentText: string) => {
    setCornVideos((prev) =>
      prev.map((v) => {
        if (v.id !== videoId) return v;
        const newComm = {
          id: 'comm-' + Date.now(),
          author: currentUser.alias || 'CampusStudent',
          comment: commentText,
          upvotes: 1,
          timestamp: 'Just now',
        };
        return {
          ...v,
          comments: [newComm, ...(v.comments || [])],
        };
      })
    );
    showToast('Your comment was posted to CornHub!');
  };

  // Check Supabase connectivity and initial load
  const refreshSupabase = async () => {
    const health = await checkSupabaseHealth();
    setSupabaseHealth(health);
    if (health.tableReady) {
      const remotePosts = await fetchSupabasePosts();
      if (remotePosts && remotePosts.length > 0) {
        setPosts(remotePosts);
      }
    }
  };

  useEffect(() => {
    refreshSupabase();

    // Check Full-Stack backend auth and initial posts
    fetchCurrentAuthUser().then((authUser) => {
      if (authUser) {
        setIsLoggedIn(true);
        setCurrentUser((prev) => ({
          ...prev,
          id: authUser.id,
          realName: authUser.realName,
          alias: authUser.alias,
          university: authUser.university,
          program: authUser.program,
          year: authUser.year,
        }));
      }
    });

    fetchBackendPosts().then((backendPosts) => {
      if (backendPosts && backendPosts.length > 0) {
        setPosts(backendPosts);
      }
    });

    // 1. Supabase Realtime Broadcast Channel: Instant sub-50ms peer-to-peer sync across all phones
    const broadcastChannel = getLiveBroadcastChannel();

    broadcastChannel
      .on('broadcast', { event: 'new_post' }, ({ payload }: { payload: GossipPost }) => {
        if (!payload || !payload.id) return;
        setPosts((prev) => {
          if (prev.some((p) => p.id === payload.id)) return prev;
          showToast(`🔥 New whisper dropped from ${payload.university.toUpperCase()}!`);
          return [payload, ...prev];
        });
      })
      .on('broadcast', { event: 'post_voted' }, ({ payload }: { payload: { postId: string; upvotes: number; downvotes: number } }) => {
        if (!payload || !payload.postId) return;
        setPosts((prev) =>
          prev.map((p) =>
            p.id === payload.postId
              ? { ...p, upvotes: payload.upvotes, downvotes: payload.downvotes }
              : p
          )
        );
      })
      .on('broadcast', { event: 'new_comment' }, ({ payload }: { payload: { postId: string; comment: any } }) => {
        if (!payload || !payload.postId || !payload.comment) return;
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id !== payload.postId) return p;
            if (p.comments.some((c) => c.id === payload.comment.id)) return p;
            return {
              ...p,
              commentsCount: p.commentsCount + 1,
              comments: [...p.comments, payload.comment],
            };
          })
        );
        setSelectedPostForDetail((prev) => {
          if (!prev || prev.id !== payload.postId) return prev;
          if (prev.comments.some((c) => c.id === payload.comment.id)) return prev;
          return {
            ...prev,
            commentsCount: prev.commentsCount + 1,
            comments: [...prev.comments, payload.comment],
          };
        });
      })
      .on('broadcast', { event: 'new_message' }, ({ payload }: { payload: { message: any; recipientId: string } }) => {
        if (!payload || !payload.message) return;
        const msg = payload.message;
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === msg.conversationId || c.partnerId === msg.senderId) {
              if (c.messages.some((m) => m.id === msg.id)) return c;
              return {
                ...c,
                lastMessage: msg.text,
                lastTimestamp: 'Just now',
                messages: [...c.messages, msg],
              };
            }
            return c;
          })
        );
      });

    // 2. Supabase Realtime Postgres Changes: Database row level sync
    const postsChannel = supabase
      .channel('public:posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload: any) => {
          const row = payload.new;
          if (!row) return;
          const mappedPost: GossipPost = {
            id: row.id,
            title: row.title,
            content: row.content,
            university: row.university as UniversityId,
            campusBranch: row.campus_branch || 'Main Campus',
            category: row.category as PostCategory,
            authorAlias: row.author_alias,
            isAnonymous: row.is_anonymous ?? true,
            isSpoilerTea: row.is_spoiler_tea ?? false,
            eventVenue: row.event_venue,
            eventDate: row.event_date,
            isActivityLive: row.is_activity_live ?? false,
            upvotes: row.upvotes ?? 0,
            downvotes: row.downvotes ?? 0,
            commentsCount: row.comments_count ?? 0,
            comments: [],
            timestamp: 'Just now',
            tags: row.tags || [],
          };
          setPosts((prev) => {
            if (prev.some((p) => p.id === mappedPost.id)) return prev;
            return [mappedPost, ...prev];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'posts' },
        (payload: any) => {
          const row = payload.new;
          if (!row) return;
          setPosts((prev) =>
            prev.map((p) =>
              p.id === row.id
                ? {
                    ...p,
                    upvotes: row.upvotes ?? p.upvotes,
                    downvotes: row.downvotes ?? p.downvotes,
                    commentsCount: row.comments_count ?? p.commentsCount,
                  }
                : p
            )
          );
        }
      )
      .subscribe();

    // Direct whispers sync
    const messagesChannel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload: any) => {
          const row = payload.new;
          if (!row) return;
          const newMsg = {
            id: row.id,
            conversationId: row.conversation_id,
            senderId: row.sender_id,
            senderAlias: row.sender_alias,
            isSenderGhost: row.is_sender_ghost ?? false,
            text: row.text,
            timestamp: 'Just now',
          };
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === row.conversation_id || c.partnerId === row.sender_id) {
                if (c.messages.some((m) => m.id === newMsg.id)) return c;
                return {
                  ...c,
                  lastMessage: newMsg.text,
                  lastTimestamp: 'Just now',
                  messages: [...c.messages, newMsg],
                };
              }
              return c;
            })
          );
        }
      )
      .subscribe();

    // Refresh when user returns to phone tab
    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        refreshSupabase();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Google Maps Demo Key Quota Defense listener
    const handleGmpQuota = () => {
      setIsGmpQuotaExceeded(true);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('gmp-quota-exceeded', handleGmpQuota);
    }

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(messagesChannel);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (typeof window !== 'undefined') {
        window.removeEventListener('gmp-quota-exceeded', handleGmpQuota);
      }
    };
  }, []);

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('zedwhisper_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('zedwhisper_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('zedwhisper_polls', JSON.stringify(polls));
  }, [polls]);

  useEffect(() => {
    localStorage.setItem('zedwhisper_convs', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('zedwhisper_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Sorting and Filtering logic
  const filteredPosts = filterPosts(posts, selectedUniversity, selectedCategory, searchQuery);
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'latest') return 0; // maintain raw sequence or timestamp
    if (sortBy === 'discussed') return b.commentsCount - a.commentsCount;
    // default trending
    return b.upvotes - a.upvotes;
  });

  // Dynamic trending hashtags computed entirely from real student posts
  const trendingTags = React.useMemo(() => {
    const tagCountMap: Record<string, number> = {};
    posts.forEach((p) => {
      p.tags?.forEach((tag) => {
        const normalized = tag.startsWith('#') ? tag : `#${tag}`;
        tagCountMap[normalized] = (tagCountMap[normalized] || 0) + 1;
      });
    });
    return Object.entries(tagCountMap)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [posts]);

  // Dynamic post counts per university and category for W3Schools & FreeCodeCamp sidebar navigation
  const postsCountByUniversity = React.useMemo(() => {
    const counts: Record<string, number> = { all: posts.length };
    posts.forEach((p) => {
      counts[p.university] = (counts[p.university] || 0) + 1;
    });
    return counts;
  }, [posts]);

  const postsCountByCategory = React.useMemo(() => {
    const counts: Record<string, number> = { all: posts.length };
    posts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [posts]);

  // Total unread messages count
  const unreadCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);


  // Handlers for Posts & Voting
  const handleVotePost = (postId: string, direction: 'up' | 'down') => {
    let finalUp = 0;
    let finalDown = 0;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        if (post.userVoted === direction) {
          // toggle off
          const u = direction === 'up' ? post.upvotes - 1 : post.upvotes;
          const d = direction === 'down' ? post.downvotes - 1 : post.downvotes;
          finalUp = Math.max(0, u);
          finalDown = Math.max(0, d);
          return {
            ...post,
            userVoted: undefined,
            upvotes: finalUp,
            downvotes: finalDown,
          };
        }
        const prevVote = post.userVoted;
        const u = direction === 'up'
          ? post.upvotes + 1
          : prevVote === 'up'
          ? post.upvotes - 1
          : post.upvotes;
        const d = direction === 'down'
          ? post.downvotes + 1
          : prevVote === 'down'
          ? post.downvotes - 1
          : post.downvotes;
        finalUp = Math.max(0, u);
        finalDown = Math.max(0, d);
        return {
          ...post,
          userVoted: direction,
          upvotes: finalUp,
          downvotes: finalDown,
        };
      })
    );

    // Broadcast live vote to all connected phones across Zambia
    broadcastPostVote(postId, finalUp, finalDown);

    // Sync vote to Supabase
    voteSupabasePost(postId, finalUp, finalDown);
    // Sync vote to Full-Stack / InfinityFree backend
    voteBackendPost(postId, direction);

    // Also update modal view if open
    if (selectedPostForDetail && selectedPostForDetail.id === postId) {
      setSelectedPostForDetail((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          userVoted: prev.userVoted === direction ? undefined : direction,
          upvotes:
            direction === 'up'
              ? prev.userVoted === 'up'
                ? prev.upvotes - 1
                : prev.upvotes + 1
              : prev.userVoted === 'up'
              ? prev.upvotes - 1
              : prev.upvotes,
        };
      });
    }
  };

  // Open post detail and fetch latest remote comments
  const handleOpenPostDetail = async (post: GossipPost) => {
    setSelectedPostForDetail(post);
    try {
      const remoteComments = await fetchSupabaseComments(post.id);
      if (remoteComments && remoteComments.length > 0) {
        setSelectedPostForDetail((prev) =>
          prev && prev.id === post.id
            ? { ...prev, comments: remoteComments, commentsCount: Math.max(prev.commentsCount, remoteComments.length) }
            : prev
        );
        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? { ...p, comments: remoteComments, commentsCount: Math.max(p.commentsCount, remoteComments.length) }
              : p
          )
        );
      }
    } catch {
      // Graceful local state retention
    }
  };

  const handleBookmark = (postId: string) => {
    const isBookmarked = currentUser.bookmarkedPostIds.includes(postId);
    const updated = isBookmarked
      ? currentUser.bookmarkedPostIds.filter((id) => id !== postId)
      : [...currentUser.bookmarkedPostIds, postId];

    setCurrentUser((prev) => ({ ...prev, bookmarkedPostIds: updated }));
    showToast(isBookmarked ? 'Removed from bookmarks' : 'Whisper saved to bookmarks');
  };

  const handleReport = (postId: string) => {
    submitSupabaseReport(currentUser.id, postId, 'post', 'Policy safety review');
    showToast('Report submitted for moderation review. Thank you for keeping campus safe.');
  };

  const handleCreatePost = (newPostData: {
    title: string;
    content: string;
    university: UniversityId;
    campusBranch: string;
    category: PostCategory;
    isAnonymous: boolean;
    isSpoilerTea: boolean;
    tags: string[];
    eventDate?: string;
    eventVenue?: string;
    isActivityLive?: boolean;
  }) => {
    const authorAlias = newPostData.isAnonymous
      ? `Anonymous Scholar #${Math.floor(100 + Math.random() * 900)}`
      : currentUser.alias;

    const newPost: GossipPost = {
      id: `post-${Date.now()}`,
      title: newPostData.title,
      content: newPostData.content,
      university: newPostData.university,
      campusBranch: newPostData.campusBranch || 'Main Campus',
      category: newPostData.category,
      authorAlias,
      isAnonymous: newPostData.isAnonymous,
      isSpoilerTea: newPostData.isSpoilerTea,
      eventDate: newPostData.eventDate,
      eventVenue: newPostData.eventVenue,
      isActivityLive: newPostData.isActivityLive,
      upvotes: 1,
      downvotes: 0,
      userVoted: 'up',
      commentsCount: 0,
      comments: [],
      timestamp: 'Just now',
      tags: newPostData.tags,
    };

    setPosts([newPost, ...posts]);
    // Instant peer broadcast to all online phones across Zambia
    broadcastNewPost(newPost);
    // Save to central Supabase cloud database
    createSupabasePost(newPost);
    // Save to Full-Stack Node/Express & MySQL
    createBackendPost({
      title: newPostData.title,
      content: newPostData.content,
      university: newPostData.university,
      campusBranch: newPostData.campusBranch || 'Main Campus',
      category: newPostData.category,
      authorAlias,
      isAnonymous: newPostData.isAnonymous,
      tags: newPostData.tags,
    });

    // Extract @mentions from post content
    const mentionedAliases = extractMentions(newPostData.content);
    if (mentionedAliases.length > 0) {
      const newMentions: CampusMention[] = mentionedAliases.map((alias) => ({
        id: `mention-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        postId: newPost.id,
        postTitle: newPost.title,
        mentionedAlias: alias,
        authorAlias,
        authorUniversity: newPost.university,
        snippet: newPost.content.slice(0, 160),
        timestamp: 'Just now',
        isRead: false,
        type: 'post',
      }));
      setMentions((prev) => [...newMentions, ...prev]);
      if (mentionedAliases.some((a) => a.toLowerCase() === currentUser.alias.toLowerCase())) {
        showToast('You were @mentioned in a new whisper! 🔔');
      }
    }

    showToast('Campus activity update published! 📢');
  };

  const handleAddComment = (postId: string, commentText: string, isAnonymous: boolean) => {
    const authorAlias = isAnonymous
      ? `Anonymous Scholar #${Math.floor(100 + Math.random() * 900)}`
      : currentUser.alias;

    const newComment = {
      id: `c-${Date.now()}`,
      postId,
      authorAlias,
      authorUniversity: currentUser.university,
      isAuthorGhost: isAnonymous,
      content: commentText,
      upvotes: 0,
      timestamp: 'Just now',
    };

    const targetPost = posts.find((p) => p.id === postId);
    addSupabaseComment(newComment, targetPost ? targetPost.commentsCount : 0);
    // Sync to Full-Stack Node backend
    addBackendComment(postId, {
      content: commentText,
      authorAlias,
      authorUniversity: currentUser.university,
    });
    // Instant broadcast of new comment to all devices
    broadcastNewComment(postId, newComment);

    // Extract @mentions from comment text
    const mentionedAliases = extractMentions(commentText);
    if (mentionedAliases.length > 0 && targetPost) {
      const newMentions: CampusMention[] = mentionedAliases.map((alias) => ({
        id: `mention-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        postId: targetPost.id,
        postTitle: targetPost.title,
        commentId: newComment.id,
        mentionedAlias: alias,
        authorAlias,
        authorUniversity: currentUser.university,
        snippet: commentText.slice(0, 160),
        timestamp: 'Just now',
        isRead: false,
        type: 'comment',
      }));
      setMentions((prev) => [...newMentions, ...prev]);
      if (mentionedAliases.some((a) => a.toLowerCase() === currentUser.alias.toLowerCase())) {
        showToast('You were @mentioned in a reply! 🔔');
      }
    }

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, newComment],
        };
      })
    );

    if (selectedPostForDetail && selectedPostForDetail.id === postId) {
      setSelectedPostForDetail((prev) =>
        prev
          ? {
              ...prev,
              commentsCount: prev.commentsCount + 1,
              comments: [...prev.comments, newComment],
            }
          : null
      );
    }
  };

  const handleVoteComment = (postId: string, commentId: string, direction: 'up' | 'down') => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map((c) => {
            if (c.id !== commentId) return c;
            const alreadyVoted = c.userVoted === direction;
            return {
              ...c,
              userVoted: alreadyVoted ? undefined : direction,
              upvotes: alreadyVoted ? c.upvotes - 1 : c.upvotes + 1,
            };
          }),
        };
      })
    );

    if (selectedPostForDetail && selectedPostForDetail.id === postId) {
      setSelectedPostForDetail((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.map((c) =>
                c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c
              ),
            }
          : null
      );
    }
  };

  // Handlers for Campus Encounters & Gifts
  const handleOpenGiftModal = (profile: StudentProfile) => {
    setTargetProfileForGift(profile);
    setIsGiftsModalOpen(true);
  };

  const handleSendGift = (
    targetProfileId: string,
    gift: CampusGiftItem,
    isAnonymous: boolean,
    note: string
  ) => {
    // Increment user treats sent count
    setCurrentUser((prev) => ({
      ...prev,
      treatsSentCount: (prev.treatsSentCount || 0) + 1,
    }));

    // Update target profile's gifts received shelf
    const giftRecord: CampusGiftItem = {
      ...gift,
      senderAlias: isAnonymous ? 'Secret Admirer' : currentUser.alias,
      dateSent: 'Just now',
    };

    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== targetProfileId) return p;
        return {
          ...p,
          giftsReceived: [giftRecord, ...p.giftsReceived],
          reputationScore: p.reputationScore + 20,
        };
      })
    );

    showToast(`Sent ${gift.name} successfully! 🎁`);
  };

  const handleStartChatWithProfile = (targetProfile: StudentProfile) => {
    // Check if conversation already exists
    let existingConv = conversations.find((c) => c.partnerId === targetProfile.id);
    if (!existingConv) {
      existingConv = {
        id: `conv-${Date.now()}`,
        partnerId: targetProfile.id,
        partnerName: targetProfile.name,
        partnerAlias: targetProfile.alias,
        partnerUniversity: targetProfile.university,
        partnerAvatarSeed: targetProfile.name,
        lastMessage: 'Conversation opened via Campus Encounters',
        lastTimestamp: 'Just now',
        unreadCount: 0,
        isIncognito: currentUser.isGhostMode,
        messages: [
          {
            id: `m-${Date.now()}`,
            conversationId: `conv-${Date.now()}`,
            senderId: currentUser.id,
            senderAlias: currentUser.isGhostMode ? 'Anonymous Whisper' : currentUser.alias,
            isSenderGhost: currentUser.isGhostMode,
            text: `Hey ${targetProfile.name}! Saw you on ZedWhisper campus encounters.`,
            timestamp: 'Just now',
          },
        ],
      };
      setConversations([existingConv, ...conversations]);
    }

    setActiveConversationId(existingConv.id);
    setActiveTab('messages');
  };

  // Secret Crush Submission
  const handleSubmitSecretCrush = (targetHandle: string) => {
    const handleClean = targetHandle.trim();
    // Add to current user vault
    if (!currentUser.secretCrushesSubmitted.includes(handleClean)) {
      setCurrentUser((prev) => ({
        ...prev,
        secretCrushesSubmitted: [...prev.secretCrushesSubmitted, handleClean],
      }));
    }

    // Check if matches anyone in profiles (e.g. Natasha Mwamba or Kondwani Zulu)
    const matchingProfile = profiles.find(
      (p) =>
        p.alias.toLowerCase().includes(handleClean.toLowerCase().replace('@', '')) ||
        p.name.toLowerCase().includes(handleClean.toLowerCase())
    );

    // If matching profile is found, mark as match!
    if (matchingProfile) {
      return { isMatch: true, matchedProfile: matchingProfile };
    }

    return { isMatch: false };
  };

  // Polls Voting & Creating
  const handleVotePoll = (pollId: string, optionId: string) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId) return poll;
        if (poll.userVotedOptionId === optionId) return poll; // already voted this option

        const prevOptionId = poll.userVotedOptionId;
        return {
          ...poll,
          userVotedOptionId: optionId,
          totalVotes: prevOptionId ? poll.totalVotes : poll.totalVotes + 1,
          options: poll.options.map((opt) => {
            if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
            if (opt.id === prevOptionId) return { ...opt, votes: Math.max(0, opt.votes - 1) };
            return opt;
          }),
        };
      })
    );
    showToast('Anonymous campus vote recorded!');
  };

  const handleCreatePoll = (question: string, optionsTexts: string[], category: string) => {
    const newPoll: CampusPoll = {
      id: `poll-${Date.now()}`,
      question,
      university: selectedUniversity,
      category,
      totalVotes: 0,
      closingDate: 'Closes in 5 days',
      options: optionsTexts.map((txt, idx) => ({
        id: `opt-${Date.now()}-${idx}`,
        text: txt,
        votes: 0,
      })),
    };
    setPolls([newPoll, ...polls]);
    showToast('Campus poll published!');
  };

  // Direct Message Sending (Real user-driven communication, no bot simulations)
  const handleSendMessage = (conversationId: string, text: string, isGhost: boolean) => {
    const newMessage = {
      id: `m-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderAlias: isGhost ? 'Ghost Monk' : currentUser.alias,
      isSenderGhost: isGhost,
      text,
      timestamp: 'Just now',
    };

    const activeConv = conversations.find((c) => c.id === conversationId);
    if (activeConv) {
      sendSupabaseDirectMessage(newMessage, activeConv.partnerId);
      broadcastDirectMessage(newMessage, activeConv.partnerId);
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          lastMessage: text,
          lastTimestamp: 'Just now',
          messages: [...c.messages, newMessage],
        };
      })
    );
  };

  const handleToggleGhostMode = () => {
    const newMode = !currentUser.isGhostMode;
    setCurrentUser((prev) => ({ ...prev, isGhostMode: newMode }));
    showToast(newMode ? 'Ghost Mode Activated (Total Anonymity)' : 'Verified Student Persona Active');
  };

  const handleClearSession = () => {
    localStorage.clear();
    setPosts(INITIAL_POSTS);
    setProfiles(STUDENT_PROFILES);
    setPolls(CAMPUS_POLLS);
    setConversations(INITIAL_CONVERSATIONS);
    setCurrentUser(CURRENT_USER);
    setIsProfileModalOpen(false);
    showToast('Session wiped and reset for security.');
  };

  const handleOpenComposerWithVenue = (venueName: string, university: UniversityId) => {
    setSelectedUniversity(university);
    setPresetVenue({ name: venueName, university });
    setIsComposerOpen(true);
  };

  const handleViewVenueOnMap = (venueName: string, university: UniversityId) => {
    if (university !== 'all') {
      setSelectedUniversity(university);
    }
    setActiveTab('map');
    showToast(`Viewing ${venueName} on Campus Google Map 📍`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors relative">
      {/* Living Atmospheric Environmental Background */}
      <LiveEnvironmentalBackground />

      {/* Google Maps Demo Key Quota Defense Banner */}
      {isGmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-18 right-4 z-50 bg-slate-900 text-white dark:bg-emerald-600 px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Bell className="w-4 h-4 text-emerald-400 dark:text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Strict 3-zone Navbar with Global Search & Saved Whispers */}
      <Navbar
        onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenComposer={() => {
          setPresetVenue(null);
          setIsComposerOpen(true);
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenSafety={() => setIsSafetyModalOpen(true)}
        onToggleGhostMode={handleToggleGhostMode}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        unreadCount={unreadCount}
        savedCount={currentUser.bookmarkedPostIds.length}
        posts={posts}
        profiles={profiles}
        events={CAMPUS_EVENTS}
        onSelectPost={(post) => setSelectedPostForDetail(post)}
        onSelectProfile={(profile) => {
          setTargetProfileForGift(profile);
          setIsGiftsModalOpen(true);
        }}
        onSelectEvent={(evt) => {
          setActiveTab('calendar');
        }}
        mentionsCount={unreadMentionsCount}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isLoggedIn={isLoggedIn}
      />

      {/* University Campus Hub Horizontal Fast Selector */}
      {(activeTab === 'feed' || activeTab === 'dating' || activeTab === 'map' || activeTab === 'calendar' || activeTab === 'saved') && (
        <UniversityFilterBar
          selectedUniversity={selectedUniversity}
          onSelectUniversity={setSelectedUniversity}
        />
      )}

      {/* FreeCodeCamp & W3Schools Ordered Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-start gap-6">
        {/* Left Structured Navigation Sidebar */}
        <Sidebar
          selectedUniversity={selectedUniversity}
          onSelectUniversity={setSelectedUniversity}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadMentionsCount={unreadMentionsCount}
          savedCount={currentUser.bookmarkedPostIds.length}
          unreadDmsCount={unreadCount}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenComposer={() => {
            setPresetVenue(null);
            setIsComposerOpen(true);
          }}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenSafety={() => setIsSafetyModalOpen(true)}
          onOpenQrModal={() => setIsQrModalOpen(true)}
          postsCountByUniversity={postsCountByUniversity}
          postsCountByCategory={postsCountByCategory}
        />

        {/* Center Main Workspace */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumb Navigation Trail */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                setSelectedUniversity('all');
                setSelectedCategory('all');
                setActiveTab('feed');
                setSearchQuery('');
              }}
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span>ZedHub</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

            <button
              onClick={() => {
                if (activeTab !== 'feed') setActiveTab('feed');
                setSelectedCategory('all');
              }}
              className="hover:text-emerald-400 text-slate-300 font-medium transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <UniversityLogo university={selectedUniversity} size="xs" />
              <span>{currentUni.shortName}</span>
            </button>

            {activeTab === 'feed' && selectedCategory !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="text-emerald-400 font-semibold capitalize shrink-0">
                  {selectedCategory.replace('_', ' ')}
                </span>
              </>
            )}

            {activeTab !== 'feed' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="text-emerald-400 font-semibold capitalize shrink-0">
                  {activeTab === 'dating' && 'ZedMatch Encounters'}
                  {activeTab === 'secret_crush' && 'Secret Crush Lockbox'}
                  {activeTab === 'polls' && 'Campus Polls'}
                  {activeTab === 'messages' && 'Direct Whispers'}
                  {activeTab === 'map' && 'Campus Google Map'}
                  {activeTab === 'calendar' && 'Event Calendar'}
                  {activeTab === 'saved' && 'Saved Whispers'}
                  {activeTab === 'mentions' && '@Mentions & Tags'}
                  {activeTab === 'marketplace' && 'Campus Marketplace & ZedStore'}
                  {(activeTab === 'cinema' || activeTab === 'cornhub') && 'ZedWhisper Cinema & Video Hub'}
                </span>
              </>
            )}

            {searchQuery && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="text-amber-400 italic shrink-0">"{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-500 hover:text-slate-300 ml-0.5 cursor-pointer"
                  aria-label="Clear search filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            )}
          </div>

          {/* W3Schools / FreeCodeCamp Structured Topic Header Banner */}
          <div className="bg-[#0c1527] border border-[#1e294b] rounded-xl p-4 sm:p-5 mb-5 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#080d1a] border border-[#1e294b] flex items-center justify-center shrink-0 p-1 shadow-inner">
                  <UniversityLogo university={selectedUniversity} size="md" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-base sm:text-lg font-display font-bold text-white tracking-tight truncate">
                      {activeTab === 'feed'
                        ? currentUni.name
                        : activeTab === 'dating'
                        ? 'Campus Crush & Dating Encounters'
                        : activeTab === 'secret_crush'
                        ? 'Secret Crush Lockbox'
                        : activeTab === 'polls'
                        ? 'Campus Polls & Student Hot Takes'
                        : activeTab === 'messages'
                        ? 'Direct Whispers & Student Inbox'
                        : activeTab === 'map'
                        ? `${currentUni.shortName} Campus Map & Venues`
                        : activeTab === 'calendar'
                        ? `${currentUni.shortName} Campus Events Calendar`
                        : activeTab === 'saved'
                        ? 'My Saved Campus Whispers'
                        : activeTab === 'marketplace'
                        ? `${currentUni.shortName} Student Marketplace & Store`
                        : activeTab === 'cinema' || activeTab === 'cornhub'
                        ? 'ZedWhisper Video Hub · Campus Activities Streaming'
                        : 'Campus @Mentions & Peer Tags'}
                    </h1>
                    {activeTab === 'feed' && (
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                        {selectedCategory === 'all' ? 'All Activities' : selectedCategory.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                    <span className="italic">{currentUni.motto}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-300">{currentUni.city}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-emerald-400 font-medium">
                      {activeTab === 'cinema' || activeTab === 'cornhub'
                        ? `${studentVideos.length} Campus Videos Streaming`
                        : activeTab === 'marketplace'
                        ? `${marketplaceProducts.length} Products Available`
                        : activeTab === 'feed'
                        ? `${sortedPosts.length} Whispers Active`
                        : `${profiles.length} Verified Students`}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <button
                  onClick={() => {
                    setPresetVenue(null);
                    setIsComposerOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post Here</span>
                </button>

                {selectedUniversity !== 'all' && activeTab !== 'map' && (
                  <button
                    onClick={() => setActiveTab('map')}
                    className="px-3 py-1.5 rounded-lg bg-[#080d1a] hover:bg-[#111c35] border border-[#1e294b] text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Explore on Campus Map"
                  >
                    <Compass className="w-3.5 h-3.5 text-teal-400" />
                    <span className="hidden sm:inline">Map</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tab 1: Campus Buzz & Anonymous Gossip */}
          {activeTab === 'feed' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 8 columns: Post Categories & Feed */}
              <div className="lg:col-span-8">
                <CategoryFilterBar
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />

                <GossipFeed
                  posts={sortedPosts}
                  onVote={handleVotePost}
                  onOpenPostDetail={handleOpenPostDetail}
                  onBookmark={handleBookmark}
                  bookmarkedIds={currentUser.bookmarkedPostIds}
                  onReport={handleReport}
                  onOpenComposer={() => setIsComposerOpen(true)}
                  onToggleReaction={handleToggleReaction}
                  onMentionClick={(alias) => {
                    const peer = profiles.find((p) => p.alias.toLowerCase() === alias.toLowerCase());
                    if (peer) {
                      setTargetProfileForGift(peer);
                      setIsGiftsModalOpen(true);
                    }
                  }}
                  studentVideos={studentVideos}
                  onSelectStudentVideo={(v) => setSelectedStudentVideo(v)}
                  onOpenVideoHub={() => setActiveTab('cinema')}
                  cornVideos={cornVideos}
                  onSelectCornVideo={(v) => setSelectedCornVideo(v)}
                  onOpenCornHub={() => setActiveTab('cinema')}
                />
            </div>

            {/* Right 4 columns: Campus Spotlight, Trending Hot Topics & Quick Actions */}
            <div className="lg:col-span-4 space-y-6">
              {/* Zambian Student Verification Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Student Safety & Anonymity</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Post freely without fear. Your real identity is protected by zero-knowledge tripcodes and automated anti-doxxing shields.
                </p>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Current persona:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    {currentUser.isGhostMode ? '👻 Incognito Monk' : `🎓 ${currentUser.alias}`}
                  </span>
                </div>
              </div>

              {/* Trending Campus Topics */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>Trending on Zambian Campuses</span>
                </h3>

                {trendingTags.length === 0 ? (
                  <div className="py-4 text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      No trending topics yet. As students post whispers with hashtags (#unza, #cbu, #exams), real trending topics will appear here live!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    {trendingTags.map((item) => (
                      <button
                        key={item.tag}
                        onClick={() => {
                          setSearchQuery(item.tag.replace('#', ''));
                          setSelectedCategory('all');
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.tag}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {item.count} {item.count === 1 ? 'whisper' : 'whispers'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Featured Live Campus Poll Widget */}
              {polls.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0c1527] border border-[#1e294b] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      <BarChart3 className="w-4 h-4" />
                      <span>Live Campus Poll</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('polls')}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                    >
                      All Polls →
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-white leading-snug">
                    {polls[0].question}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    {polls[0].options.slice(0, 3).map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleVotePoll(polls[0].id, opt.id)}
                        className="w-full text-left p-2 rounded-lg bg-[#080d1a] hover:bg-[#111c35] border border-[#1e294b] text-xs text-slate-300 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span className="truncate pr-2">{opt.text}</span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {opt.votes}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Upcoming Campus Event */}
              {CAMPUS_EVENTS.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0c1527] border border-[#1e294b] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 uppercase tracking-wider">
                      <Calendar className="w-4 h-4" />
                      <span>Upcoming Campus Event</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('calendar')}
                      className="text-[11px] text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
                    >
                      Calendar →
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-[#080d1a] border border-[#1e294b] space-y-1">
                    <p className="text-xs font-bold text-white truncate">
                      {CAMPUS_EVENTS[0].title}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span className="text-purple-400 font-medium">{CAMPUS_EVENTS[0].date}</span>
                      <span>·</span>
                      <span className="truncate">{CAMPUS_EVENTS[0].venue}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Quick Campus Encounters Teaser */}
              <div className="p-5 rounded-2xl bg-gradient-to-tr from-pink-500/10 via-rose-500/5 to-amber-500/10 border border-pink-200 dark:border-pink-900/40 space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                  <span className="text-xs font-bold text-pink-700 dark:text-pink-300">
                    ZedMatch Encounters
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Swipe through verified student profiles across UNZA, CBU, Mulungushi, and Cavendish.
                </p>
                <button
                  onClick={() => setActiveTab('dating')}
                  className="w-full py-2 text-xs font-bold text-pink-700 dark:text-pink-300 bg-white dark:bg-slate-800 rounded-xl border border-pink-200 dark:border-pink-800/60 hover:bg-pink-50 transition-colors shadow-xs"
                >
                  Explore Campus Crushes →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Campus Crush & Dating Encounters (Reverse engineered from Youdate!) */}
        {activeTab === 'dating' && (
          <CampusCrushEncounter
            profiles={profiles}
            currentUser={currentUser}
            onSendGiftClick={handleOpenGiftModal}
            onStartChat={handleStartChatWithProfile}
            onMatchCreated={(matchedProfile) => {
              showToast(`You and ${matchedProfile.name} matched! 🎉`);
            }}
          />
        )}

        {/* Tab 3: Secret Crush Lockbox */}
        {activeTab === 'secret_crush' && (
          <SecretCrushModal
            currentUser={currentUser}
            profiles={profiles}
            onSubmitCrush={handleSubmitSecretCrush}
            onStartChat={handleStartChatWithProfile}
          />
        )}

        {/* Tab 4: Campus Polls & Hot Takes */}
        {activeTab === 'polls' && (
          <CampusPolls
            polls={polls}
            currentUser={currentUser}
            onVotePoll={handleVotePoll}
            onCreatePoll={handleCreatePoll}
          />
        )}

        {/* Tab 5: Whisper Direct Messages */}
        {activeTab === 'messages' && (
          <DirectMessages
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
          />
        )}

        {/* Tab 6: Zambian Campus Google Map */}
        {activeTab === 'map' && (
          <CampusGoogleMap
            selectedUniversity={selectedUniversity}
            onSelectUniversity={setSelectedUniversity}
            onOpenComposerWithVenue={handleOpenComposerWithVenue}
            onViewEventsForVenue={(venue) => {
              setActiveTab('calendar');
              showToast(`Showing events for ${venue}`);
            }}
          />
        )}

        {/* Tab 7: Campus Event Calendar */}
        {activeTab === 'calendar' && (
          <CampusEventCalendar
            selectedUniversity={selectedUniversity}
            onSelectUniversity={setSelectedUniversity}
            onViewVenueOnMap={handleViewVenueOnMap}
          />
        )}

        {/* Tab 8: Dedicated Saved Whispers View */}
        {activeTab === 'saved' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-xs font-semibold mb-1.5">
                  <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>Private Bookmarks</span>
                </div>
                <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                  Saved Campus Whispers
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentUser.bookmarkedPostIds.length} bookmarked {currentUser.bookmarkedPostIds.length === 1 ? 'post' : 'posts'} stored privately for you
                </p>
              </div>

              <button
                onClick={() => setActiveTab('feed')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Back to Campus Feed</span>
              </button>
            </div>

            {/* Saved Posts List or Empty State */}
            {posts.filter((p) => (currentUser.bookmarkedPostIds.includes(p.id) || p.is_saved === true) && (selectedUniversity === 'all' || p.university === selectedUniversity)).length === 0 ? (
              <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800/60">
                  <Bookmark className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  No Saved Whispers Found
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-2">
                  Whenever you come across valuable campus updates, exam past papers, hostel notices, or spicy gossip from the feed, click the Bookmark icon on the card to save it here for quick access.
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                  Items you bookmark are private and never exposed to other students or public feeds.
                </p>
                <button
                  onClick={() => setActiveTab('feed')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Browse Campus Feed</span>
                </button>
              </div>
            ) : (
              <GossipFeed
                posts={posts.filter((p) => (currentUser.bookmarkedPostIds.includes(p.id) || p.is_saved === true) && (selectedUniversity === 'all' || p.university === selectedUniversity))}
                onVote={handleVotePost}
                onOpenPostDetail={handleOpenPostDetail}
                onBookmark={handleBookmark}
                bookmarkedIds={currentUser.bookmarkedPostIds}
                onReport={handleReport}
                onOpenComposer={() => setIsComposerOpen(true)}
              />
            )}
          </div>
        )}

        {/* Tab 9: Dedicated Peer Mentions Tab */}
        {activeTab === 'mentions' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <MentionsFeed
              mentions={mentions}
              currentUser={currentUser}
              onSelectMention={(m) => {
                const targetPost = posts.find((p) => p.id === m.postId);
                if (targetPost) {
                  setSelectedPostForDetail(targetPost);
                }
              }}
              onMarkAllAsRead={() => {
                setMentions((prev) => prev.map((m) => ({ ...m, isRead: true })));
              }}
              onMarkAsRead={(id) => {
                setMentions((prev) =>
                  prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
                );
              }}
              onMentionClickAlias={(alias) => {
                const peer = profiles.find((p) => p.alias.toLowerCase() === alias.toLowerCase());
                if (peer) {
                  setTargetProfileForGift(peer);
                  setIsGiftsModalOpen(true);
                }
              }}
            />
          </div>
        )}

        {/* Tab 10: Campus Marketplace (ZedStore) */}
        {activeTab === 'marketplace' && (
          <CampusMarketplace
            products={marketplaceProducts}
            orders={orders}
            currentUser={currentUser}
            selectedUniversity={selectedUniversity}
            onSelectUniversity={setSelectedUniversity}
            onAddToCart={handleAddToCart}
            onOpenProductDetail={(prod) => setSelectedMarketplaceProduct(prod)}
            onOpenSellModal={() => setIsSellModalOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
            cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
          />
        )}

        {/* Tab 11: ZedWhisper Video Hub (Campus Activities Cinema) */}
        {(activeTab === 'cinema' || activeTab === 'cornhub') && (
          activeWatchStudentVideo ? (
            <StudentWatchPage
              video={activeWatchStudentVideo}
              allVideos={studentVideos}
              onSelectVideo={(v) => setActiveWatchStudentVideo(v)}
              onBackToPortal={() => setActiveWatchStudentVideo(null)}
              onExitToZedWhisper={() => {
                setActiveWatchStudentVideo(null);
                setActiveTab('feed');
              }}
            />
          ) : (
            <ZedWhisperVideoPortal
              videos={studentVideos}
              onSelectVideo={(v) => setSelectedStudentVideo(v)}
              onOpenWatchPage={(v) => setActiveWatchStudentVideo(v)}
              isStandalone={false}
              onToggleStandalone={() => setIsStandaloneVideoHub(true)}
              onExitToZedWhisper={() => setActiveTab('feed')}
            />
          )
        )}

        {/* Tab 12: Fullstack Dev Studio & Lab (freeCodeCamp & Scrimba) */}
        {activeTab === 'devlab' && (
          <FullstackDevStudio />
        )}
      </main>
    </div>

      {/* Footer */}
      <footer className="border-t border-[#1e294b] py-6 bg-[#080d1a] text-xs text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-white">
              ZedWhisper
            </span>
            <span>·</span>
            <span>For all Higher Learning Institutions in Zambia</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
            <button
              onClick={() => setIsSafetyModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Cyber Safety Rules
            </button>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              My Campus ID
            </button>
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-slate-400 cursor-pointer"
              title="Campus Social QR Code"
            >
              <span>Social QR Code</span>
            </button>
            <span>© 2026 ZedWhisper Zambia</span>
          </div>
        </div>
      </footer>

      {/* Modal Dialogs */}
      <PostComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        currentUser={currentUser}
        initialVenue={presetVenue?.name}
        initialUniversity={presetVenue?.university}
        onSubmitPost={handleCreatePost}
      />

      <PostDetailModal
        post={selectedPostForDetail}
        isOpen={Boolean(selectedPostForDetail)}
        onClose={() => setSelectedPostForDetail(null)}
        currentUser={currentUser}
        onVotePost={handleVotePost}
        onAddComment={handleAddComment}
        onVoteComment={handleVoteComment}
        onReport={handleReport}
        onToggleReaction={handleToggleReaction}
        onMentionClick={(alias) => {
          const peer = profiles.find((p) => p.alias.toLowerCase() === alias.toLowerCase());
          if (peer) {
            setTargetProfileForGift(peer);
            setIsGiftsModalOpen(true);
          }
        }}
      />

      <GiftsModal
        isOpen={isGiftsModalOpen}
        onClose={() => {
          setIsGiftsModalOpen(false);
          setTargetProfileForGift(null);
        }}
        targetProfile={targetProfileForGift}
        currentUser={currentUser}
        onSendGift={handleSendGift}
      />

      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onToggleGhostMode={handleToggleGhostMode}
        onClearSession={handleClearSession}
        onOpenQrModal={() => setIsQrModalOpen(true)}
      />

      <StudentQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        currentUser={currentUser}
        profiles={profiles}
        onStartChatWithProfile={handleStartChatWithProfile}
        onOpenGiftModal={handleOpenGiftModal}
        onDropCrush={handleSubmitSecretCrush}
      />

      <SafetyGuidelinesModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Campus Marketplace & Storefront Modals */}
      <MarketplaceProductModal
        product={selectedMarketplaceProduct}
        onClose={() => setSelectedMarketplaceProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={(prod, qty) => {
          handleAddToCart(prod, qty);
          setIsCheckoutOpen(true);
        }}
        onContactSeller={(sellerAlias) => {
          const peer = profiles.find((p) => p.alias.toLowerCase() === sellerAlias.toLowerCase());
          if (peer) {
            handleStartChatWithProfile(peer);
          } else {
            showToast(`Opening whisper thread with @${sellerAlias}...`);
            setActiveTab('messages');
          }
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currentUser={currentUser}
        appliedCouponCode={appliedCheckoutCoupon}
        onOrderComplete={handleOrderComplete}
      />

      <SellProductModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        currentUser={currentUser}
        onAddProduct={handleAddProduct}
      />

      {/* ZedWhisper Student Video Modal Player */}
      <StudentVideoModal
        video={selectedStudentVideo}
        onClose={() => setSelectedStudentVideo(null)}
        onVote={handleVoteStudentVideo}
        onAddComment={handleAddStudentComment}
        onOpenWatchPage={(v) => {
          setSelectedStudentVideo(null);
          setActiveWatchStudentVideo(v);
          setActiveTab('cinema');
        }}
      />

      {/* Standalone Fullscreen ZedWhisper Video Hub Cinema Experience */}
      {isStandaloneVideoHub && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black text-white">
          {activeWatchStudentVideo ? (
            <StudentWatchPage
              video={activeWatchStudentVideo}
              allVideos={studentVideos}
              onSelectVideo={(v) => setActiveWatchStudentVideo(v)}
              onBackToPortal={() => setActiveWatchStudentVideo(null)}
              onExitToZedWhisper={() => {
                setActiveWatchStudentVideo(null);
                setIsStandaloneVideoHub(false);
              }}
            />
          ) : (
            <ZedWhisperVideoPortal
              videos={studentVideos}
              onSelectVideo={(v) => setSelectedStudentVideo(v)}
              onOpenWatchPage={(v) => setActiveWatchStudentVideo(v)}
              isStandalone={true}
              onToggleStandalone={() => setIsStandaloneVideoHub(false)}
              onExitToZedWhisper={() => setIsStandaloneVideoHub(false)}
            />
          )}
        </div>
      )}

      {/* Legacy CornHub Video Modal & Overlay fallback */}
      <CornVideoModal
        video={selectedCornVideo}
        onClose={() => setSelectedCornVideo(null)}
        onVote={handleVoteCornVideo}
        onAddComment={handleAddCornComment}
        onOpenWatchPage={(v) => {
          setSelectedCornVideo(null);
          setActiveWatchVideo(v);
          setActiveTab('cinema');
        }}
      />

      {isStandaloneCornHub && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black text-white">
          {activeWatchVideo ? (
            <CornWatchPage
              video={activeWatchVideo}
              allVideos={cornVideos}
              onSelectVideo={(v) => setActiveWatchVideo(v)}
              onBackToPortal={() => setActiveWatchVideo(null)}
              onExitToZedWhisper={() => {
                setActiveWatchVideo(null);
                setIsStandaloneCornHub(false);
              }}
            />
          ) : (
            <CornHubPortal
              videos={cornVideos}
              onSelectVideo={(v) => setSelectedCornVideo(v)}
              onOpenWatchPage={(v) => setActiveWatchVideo(v)}
              isStandalone={true}
              onToggleStandalone={() => setIsStandaloneCornHub(false)}
              onExitToZedWhisper={() => setIsStandaloneCornHub(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}
