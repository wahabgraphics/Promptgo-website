import { PromptItem, MasterPromptGuide, AITool } from '../types';

export const INITIAL_CATEGORIES = [
  'All Categories',
  'Animal & Pets',
  'Art & Animation',
  'ASMR',
  'Comedy',
  'DIY & Crafts',
  'Cinematic',
  'Historical & Nostalgia',
  'Fantasy & Sci-Fi',
  'TikTok Trends',
  'Commercial & Product'
];

export const INITIAL_PROMPTS: PromptItem[] = [
  {
    id: 'prompt-1',
    title: 'CUTE BABY TIGER IN GOLDEN ROYAL ARMOR WALKING IN SNOW',
    category: 'Animal & Pets',
    thumbnail_url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=900&q=80',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-little-tiger-playing-with-snow-48601-large.mp4',
    prompt_text: 'Cinematic 4K video, extreme close-up of a tiny adorable baby white tiger cub wearing ornate filigree golden royal armor, soft fluffy fur dusted with glistening snowflakes, walking proudly through an enchanted snowy pine forest during golden hour, cinematic lighting, shallow depth of field, hyper-realistic, photorealistic fur physics, shot on 35mm Arri Alexa 8k, Unreal Engine 5 render style --ar 9:16 --motion 6 --style raw',
    is_premium: false,
    views_count: '149.2M',
    created_at: '2026-11-10T14:22:00Z',
    model_recommended: 'Kling AI 1.5 / Runway Gen-3 Alpha',
    aspect_ratio: '9:16',
    tags: ['tiger', 'cute', 'viral', 'snow', 'cinematic']
  },
  {
    id: 'prompt-2',
    title: 'MICHELIN CHEF CAT MAKING FRESH HANDMADE PASTA ASMR',
    category: 'ASMR',
    thumbnail_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80',
    prompt_text: 'Top-down macro culinary video of a fluffy Scottish Fold cat wearing a miniature white chef hat and apron, rolling fresh golden dough with tiny wooden rolling pin, chopping fresh basil leaves on a rustic walnut cutting board, warm cozy Italian kitchen ambient lighting, dust particles floating in sunlight, crisp ASMR sound cues, 60fps ultra-realistic slow motion --ar 9:16 --motion 4',
    is_premium: true,
    views_count: '88.4M',
    created_at: '2026-11-09T18:10:00Z',
    model_recommended: 'Luma Dream Machine / Kling AI',
    aspect_ratio: '9:16',
    tags: ['cat', 'cooking', 'asmr', 'kitchen', 'cozy']
  },
  {
    id: 'prompt-3',
    title: 'NEON CYBERPUNK MOTORCYCLE SPEEDING IN TOKYO RAINSTORM',
    category: 'Cinematic',
    thumbnail_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
    prompt_text: 'High-speed tracking shot behind an exotic glowing matte-black futuristic motorcycle tearing through Shinjuku Tokyo in torrential midnight rain, water droplets spraying off tires in slow motion, reflections of neon kanji billboards in wet asphalt, synthwave pink and electric cyan color grade, anamorphic lens flare, motion blur, 8k ray tracing --ar 16:9 --motion 8',
    is_premium: false,
    views_count: '64.1M',
    created_at: '2026-11-08T11:45:00Z',
    model_recommended: 'Runway Gen-3 Alpha',
    aspect_ratio: '16:9',
    tags: ['cyberpunk', 'tokyo', 'rain', 'motorcycle', 'speed']
  },
  {
    id: 'prompt-4',
    title: 'HANDMADE PAPER CUTOUT ADVENTURE IN ENCHANTED JUNGLE',
    category: 'DIY & Crafts',
    thumbnail_url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=900&q=80',
    prompt_text: 'Stop-motion paper craft animation of a tiny paper origami explorer wandering through a multi-layered textured cardstock jungle, 3D paper cut foliage, depth of field with paper shadows, tactile paper fiber textures, handmade aesthetic, charming 12fps stop-motion rhythm, soft studio overhead spotlight --ar 9:16 --motion 3',
    is_premium: true,
    views_count: '42.9M',
    created_at: '2026-11-07T09:30:00Z',
    model_recommended: 'Midjourney v6.1 + Kling',
    aspect_ratio: '9:16',
    tags: ['papercraft', 'stopmotion', 'origami', 'crafts']
  },
  {
    id: 'prompt-5',
    title: 'TALKING FRENCH BULLDOG BREAKING NEWS ANCHOR LIVE',
    category: 'Comedy',
    thumbnail_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=80',
    prompt_text: 'Realistic television broadcast studio, funny French Bulldog dressed in formal charcoal suit and red tie sitting at a polished anchor desk, shuffling paper notes with paws, expressive funny facial expressions talking directly to camera, lower third breaking news graphic "TREAT SUPPLY CRITICAL", studio lighting, professional BBC newsroom background --ar 9:16 --motion 5',
    is_premium: false,
    views_count: '112.5M',
    created_at: '2026-11-06T15:20:00Z',
    model_recommended: 'Hailuo AI (MiniMax) / Kling',
    aspect_ratio: '9:16',
    tags: ['bulldog', 'comedy', 'funny', 'news', 'viral']
  },
  {
    id: 'prompt-6',
    title: 'VINTAGE 1986 DARK FANTASY VHS MOVIE OPENING SCENE',
    category: 'Historical & Nostalgia',
    thumbnail_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
    prompt_text: 'Authentic 1980s dark fantasy film frame, 35mm grainy vintage Kodak stock, tracking camera approaching an ancient obsidian fortress under an eerie violet eclipse, cloaked sorcerer holding glowing amber staff, heavy mist drifting across moors, subtle VHS tape glitch lines, analog warmth, directed by Ridley Scott circa 1985 --ar 16:9 --motion 5',
    is_premium: true,
    views_count: '76.8M',
    created_at: '2026-11-05T20:15:00Z',
    model_recommended: 'Midjourney v6 + Runway Gen-3',
    aspect_ratio: '16:9',
    tags: ['retro', 'vhs', 'darkfantasy', '80s', 'cinematic']
  },
  {
    id: 'prompt-7',
    title: 'MINIATURE TOKYO RAMEN SHOP INSIDE A VINTAGE LIGHTBULB',
    category: 'Art & Animation',
    thumbnail_url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=900&q=80',
    prompt_text: 'Macro tilt-shift video of a glowing vintage Edison lightbulb resting on a wooden desk, inside the glass bulb is a tiny bustling Tokyo ramen stall with steam rising from noodle bowls, miniature lantern swaying in gentle draft, warm incandescent filaments framing the miniature world, bokeh background, hyper-detailed diorama --ar 9:16 --motion 4',
    is_premium: true,
    views_count: '95.3M',
    created_at: '2026-11-04T13:40:00Z',
    model_recommended: 'Luma Dream Machine',
    aspect_ratio: '9:16',
    tags: ['miniature', 'ramen', 'diorama', 'macro', 'cozy']
  },
  {
    id: 'prompt-8',
    title: 'SATISFYING KINETIC RAINBOW SAND SLICING WITH HEATED BLADE',
    category: 'ASMR',
    thumbnail_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80',
    prompt_text: 'Close up ASMR video of a red glowing heated ceramic knife gently slicing through a multi-layered neon kinetic sand block, crisp crumbling layers tumbling cleanly, vivid pastel colors, pristine white studio background, zero blur, sharp macro detail, satisfying texture audio visual sync --ar 9:16 --motion 3',
    is_premium: false,
    views_count: '53.7M',
    created_at: '2026-11-03T17:50:00Z',
    model_recommended: 'Kling AI 1.5',
    aspect_ratio: '9:16',
    tags: ['asmr', 'sand', 'satisfying', 'oddlysatisfying']
  },
  {
    id: 'prompt-9',
    title: 'FUTURISTIC SNEAKER SELF-ASSEMBLING IN ZERO GRAVITY',
    category: 'Commercial & Product',
    thumbnail_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80',
    prompt_text: 'Commercial cinematic product reveal, high-tech aerodynamic running shoe floating in pitch dark zero-gravity chamber, carbon fiber plates and iridescent knit fabric weaving themselves together seamlessly with glowing laser stitching, dramatic rim lighting, particles of liquid metal forming the cushioned sole, 120fps slow motion 4k commercial --ar 16:9 --motion 7',
    is_premium: true,
    views_count: '37.4M',
    created_at: '2026-11-02T19:00:00Z',
    model_recommended: 'Runway Gen-3 Alpha',
    aspect_ratio: '16:9',
    tags: ['sneaker', 'commercial', 'futuristic', '3d', 'product']
  },
  {
    id: 'prompt-10',
    title: 'GOLDEN RETRIEVER DANCING SHUFFLE IN DISCO SUNGLASSES',
    category: 'TikTok Trends',
    thumbnail_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80',
    prompt_text: 'Viral TikTok style video, happy golden retriever wearing holographic star sunglasses and oversized retro headphones, doing energetic synchronized shuffle dance moves on a colorful LED dance floor, confetti falling from above, neon strobe lights, playful cheerful energy, vertical mobile screen ratio --ar 9:16 --motion 8',
    is_premium: false,
    views_count: '168.0M',
    created_at: '2026-11-01T12:00:00Z',
    model_recommended: 'Hailuo AI / Kling AI',
    aspect_ratio: '9:16',
    tags: ['dog', 'dance', 'tiktok', 'viral', 'shuffle']
  },
  {
    id: 'prompt-11',
    title: 'SLOW-MOTION LIQUID SPLASH MORPHING INTO CRYSTAL CROWN',
    category: 'Cinematic',
    thumbnail_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80',
    prompt_text: 'Ultra-high-speed Phantom Flex 4k footage at 1000fps, single turquoise water drop impacting still black pool, the resulting droplet crown freezes mid-air and crystallizes into a sparkling diamond tiara, refracted light prisms, dark moody backdrop, macro lens, pristine liquid physics simulation --ar 9:16 --motion 4',
    is_premium: true,
    views_count: '49.1M',
    created_at: '2026-10-31T08:30:00Z',
    model_recommended: 'Luma Dream Machine',
    aspect_ratio: '9:16',
    tags: ['water', 'crystallize', 'liquid', 'macro', 'slowmo']
  },
  {
    id: 'prompt-12',
    title: 'PIXAR STYLE BABY DRAGON DRINKING BOBA MILK TEA IN RAIN',
    category: 'Art & Animation',
    thumbnail_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80',
    prompt_text: 'Pixar 3D animation style, adorable chubby emerald green baby dragon with oversized golden eyes sheltered under a giant lotus leaf in a cozy rainy alleyway, happily sipping tapioca pearls from a giant cup of boba milk tea with a wide straw, warm lantern glow reflected in puddles, whimsical delightful facial expressions, Disney Pixar render style --ar 9:16 --motion 5',
    is_premium: false,
    views_count: '131.6M',
    created_at: '2026-10-30T16:45:00Z',
    model_recommended: 'Midjourney v6 + Kling',
    aspect_ratio: '9:16',
    tags: ['dragon', 'pixar', 'boba', 'cute', 'animation']
  }
];

export const INITIAL_MASTER_PROMPTS: MasterPromptGuide[] = [
  {
    id: 'master-1',
    title: 'The Universal 3D Cute Animal Formula (100M+ TikTok Viral Blueprint)',
    slug: 'universal-3d-cute-animal-formula',
    category: 'Animal & Pets',
    description: 'Learn the exact syntactic structure and negative prompts used by top TikTok AI creators to generate viral baby animal videos that hit millions of views consistently.',
    featured_image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80',
    full_guide: `### Overview: Why This Formula Dominates Short-Form Feeds

Over the past 6 months, accounts like @soniprompts and @umairtiktokwala have generated tens of millions of views using hyper-specific prompt patterns centered around **Pixar-textured cute creatures in unexpected, high-stakes environments**.

### Key Psychological Hooks
1. **The Juxtaposition Principle:** Combine overwhelming cuteness (baby fur, oversized shiny eyes) with unexpected seriousness (heavy ornate royal armor, chef hats, tactical vests).
2. **Tactile Texture Precision:** Models like Kling and Runway Gen-3 respond dramatically to tactile physical cues: "fine downy whiskers", "dusted with sugar snow crystals", "brass filigree engravings".
3. **Lighting Setup:** Always specify either **Golden Hour rim light** or **Soft volumetric Japanese lantern warmth**.

### The Master Prompt Structure:
\`[Subject Description] + [Clothing/Props Juxtaposition] + [Environmental Setting] + [Specific Camera Movement] + [Lighting & Render Engine Style] + [Parameter Tuning]\`

### Practical Step-by-Step Generation Workflow:
1. **Midjourney v6 / Flux Base Frame:** Generate the 9:16 keyframe first with crisp eye reflections.
2. **Kling AI / Hailuo AI Video Generation:** Upload image to Kling, set Motion Brush on the head, ears, and paws. Set camera to slight forward push-in.
3. **Audio ASMR Overlay:** Add soft crunching snow sounds or purring in CapCut.`,
    universal_template: `Cinematic 4K vertical video, extreme close-up portrait of an adorable chubby baby {ANIMAL} wearing detailed miniature {OUTFIT/ARMOR}, soft tactile fluffy fur, large glossy emotive eyes reflecting warm lights, walking cautiously through {MAGICAL/URBAN ENVIRONMENT}, gentle falling {PARTICLES: snow/petals/dust}, 35mm shallow depth of field, warm cinematic rim lighting, photorealistic rendering style --ar 9:16 --motion 5 --chaos 10`,
    recommended_tools: ['Kling AI 1.5', 'Midjourney v6.1', 'Runway Gen-3', 'CapCut Pro'],
    is_premium: false,
    views_count: '320K',
    read_time: '5 min read',
    created_at: '2026-11-05T10:00:00Z'
  },
  {
    id: 'master-2',
    title: 'Paper Cutout Stop-Motion Magic: The Theradiotv Animation Masterclass',
    slug: 'paper-cutout-stop-motion-magic',
    category: 'DIY & Crafts',
    description: 'Master the art of generating tangible handcrafted paper stop-motion animations that look like they were painstakingly cut by hand and animated frame by frame.',
    featured_image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80',
    full_guide: `### The Craft of AI Papercraft

Inspired by traditional Czech stop-motion and contemporary paper theater, this master prompt enables anyone to simulate textured construction paper, torn cardstock edges, and multi-planar camera depth.

### Essential Prompt Descriptors
- **Texture:** "Fibrous mulberry paper edges", "creased kraft paper folds", "cutout layers with cast drop shadows".
- **Movement:** Mention "stuttering 12 frames per second stop-motion cadence". This prevents the AI from rendering unnaturally smooth CGI movements.
- **Lighting:** Studio top-down spotlight with warm diffused side fill, casting authentic paper-on-paper shadows.

### Recommended Models:
For images, Flux.1 Schnell or Midjourney v6 with \`--style raw\`. For video motion, Luma Dream Machine gives the most stable tactile paper movements.`,
    universal_template: `Authentic handcrafted stop-motion papercraft diorama of {SCENE/CHARACTER}, constructed from multi-layered textured cardstock with torn fibrous edges, visible paper grain and shadow layers, 12fps stop-motion animation cadence, physical miniature scale, macro lens with subtle tilt-shift focus, warm studio desk illumination --ar 9:16 --motion 3`,
    recommended_tools: ['Luma Dream Machine', 'Flux.1', 'Midjourney v6.1'],
    is_premium: true,
    views_count: '185K',
    read_time: '7 min read',
    created_at: '2026-11-03T14:30:00Z'
  },
  {
    id: 'master-3',
    title: 'Hyper-Realistic Retro 1980s Dark Fantasy Cinematic Blueprint',
    slug: 'retro-80s-dark-fantasy-blueprint',
    category: 'Cinematic',
    description: 'Recreate the legendary look of 1980s cult dark fantasy epics like The Dark Crystal, Legend, and Conan with authentic analog grain and practical makeup aesthetics.',
    featured_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    full_guide: `### Reviving the Golden Age of Practical Dark Fantasy

The secret to true 80s fantasy lies in deliberately avoiding modern crisp CGI. We want heavy optical grain, matte painting horizons, fog machines, and tungsten color temperatures.

### Core Elements of the 80s Look:
1. **Camera & Film Stock:** Specify "Panavision anamorphic lenses, 35mm Kodak 5247 film stock, organic halation around light sources".
2. **Atmosphere:** Fog, sparks, incense smoke, torches, and celestial violet/amber skies.
3. **Character Design:** Heavily textured leather, hammered iron, real fur trim, and expressive prosthetic makeup styling.`,
    universal_template: `1985 dark fantasy feature film still, directed by Jim Henson and Ridley Scott, 35mm film stock with visible optical grain and organic halation, {HERO/CREATURE/SETTING}, practical makeup and animatronic puppet textures, dense atmospheric smoke, lit by flickering torchlight and celestial purple moon, moody chiaroscuro --ar 16:9 --style raw --v 6.1`,
    recommended_tools: ['Midjourney v6.1', 'Runway Gen-3 Alpha', 'Topaz Video AI'],
    is_premium: true,
    views_count: '240K',
    read_time: '6 min read',
    created_at: '2026-10-28T18:00:00Z'
  }
];

export const AI_TOOLS_DIRECTORY: AITool[] = [
  {
    name: 'Kling AI 1.5',
    category: 'Video Generation',
    description: 'State-of-the-art Chinese video model capable of 1080p high dynamic range motion, precise camera controls, and lip-sync.',
    bestFor: 'High motion viral TikTok shorts, realistic physics & action shots',
    url: 'https://klingai.com',
    badge: 'Trending #1',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Runway Gen-3 Alpha',
    category: 'Video Generation',
    description: 'Industry-standard cinematic motion generator with advanced motion brush, text-to-video, and director mode.',
    bestFor: 'Hollywood-level cinematic camera moves, fluid transitions',
    url: 'https://runwayml.com',
    badge: 'Pro Pick',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Hailuo AI (MiniMax)',
    category: 'Video Generation',
    description: 'Fast, incredibly expressive character animation model with remarkable face coherence and physics understanding.',
    bestFor: 'Talking animals, funny reactions, comedy skits',
    url: 'https://hailuoai.video',
    badge: 'Viral Maker',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Luma Dream Machine',
    category: 'Video Generation',
    description: 'Rapid video generation model known for fluid morphs, macro camera pans, and natural lighting simulation.',
    bestFor: 'Macro ASMR, 3D product animations, surreal morphs',
    url: 'https://lumalabs.ai/dream-machine',
    badge: 'Ultra Fast',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Midjourney v6.1',
    category: 'Image Generation',
    description: 'Unmatched photorealism, artistic texture fidelity, and prompt adherence for high-res keyframe source generation.',
    bestFor: 'Initial keyframes before video generation',
    url: 'https://midjourney.com',
    badge: 'Gold Standard',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Flux.1 (Black Forest Labs)',
    category: 'Image Generation',
    description: 'Open-weights high fidelity generator with incredible typography rendering and accurate anatomical structures.',
    bestFor: 'In-image text, complex multi-character compositions',
    url: 'https://blackforestlabs.ai',
    badge: 'Open Weights',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80'
  }
];
