"use client";

import { useMemo, useState } from "react";
import MainLayout from "@/components/MainLayout";
import Image from "next/image";
import { Expand, Download, Trash2, Sparkles, ImageIcon, Check, X } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

/*
 * ═══════════════════════════════════════════════════════════════════════════════
 * SPICEJAX MASTER SCENE LIBRARY
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * PHILOSOPHY:
 * Every prompt is engineered to make the SpiceJax jar the HERO while creating
 * an emotional context that triggers purchase intent. We're not just taking
 * product photos—we're telling stories that make people TASTE with their eyes.
 * 
 * TECHNICAL FOUNDATION:
 * - All prompts assume the AI will place the uploaded spice jar INTO the scene
 * - Lighting direction is specified (key light position matters for 3D form)
 * - Depth of field guidance ensures product sharpness with context blur
 * - Color temperature is intentional (warm = appetite, cool = premium)
 * - Props are specific and purposeful, never generic
 * 
 * CONVERSION PSYCHOLOGY:
 * - Hero shots → Direct purchase (add to cart)
 * - Lifestyle → Aspiration (I want that life)
 * - Process → Trust (they know what they're doing)
 * - Cuisine → Use case (I'll make this tonight)
 * - Seasonal → Urgency (limited time relevance)
 * - Social → Shareability (this will get engagement)
 * 
 * AUDIT CRITERIA:
 * ✓ Does every word earn its place?
 * ✓ Would a real photographer understand this brief?
 * ✓ Does it trigger appetite/desire?
 * ✓ Is the spice jar clearly the hero?
 * ✓ Will this still work in 5 years?
 */

const SCENE_PRESETS = [
  // ═══════════════════════════════════════════════════════════════
  // HERO SHOTS — E-commerce ready, add-to-cart triggers
  // These are your money shots. Clean, premium, undeniable quality.
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "hero-dark", 
    label: "Dark & Dramatic", 
    category: "hero",
    prompt: "Place the spice jar as the hero on a matte black Belgian bluestone surface. Single key light from 45 degrees camera-left creating a sharp highlight on the jar's edge and deep shadow on the right. Shallow depth of field at f/2.0 with the label tack-sharp. Scatter 5-7 whole peppercorns and a small pile of flaky Maldon sea salt in the foreground, slightly out of focus. Subtle smoke wisp rising from behind the jar, backlit. Surface shows subtle reflection of the jar. Mood: luxurious, mysterious, premium. Style: Ottolenghi cookbook cover meets high-end whiskey advertising. Shot on 85mm lens, medium format sensor quality." 
  },
  { 
    id: "hero-marble", 
    label: "Clean Marble", 
    category: "hero",
    prompt: "Position the spice jar on genuine Carrara marble with subtle grey veining running diagonally. Large softbox from above-right creating even, diffused illumination with soft shadows falling to the bottom-left. One small sprig of fresh thyme placed 2 inches from the jar at 7 o'clock position. Generous negative space on the right side for text overlay. Background is pure white, seamlessly blending with the marble edge. Color temperature: neutral 5500K for accurate label colors. Mood: clean, trustworthy, premium grocery. Style: Whole Foods end-cap display, Williams-Sonoma catalog. Sharp focus throughout at f/8." 
  },
  { 
    id: "hero-wood", 
    label: "Artisan Wood", 
    category: "hero",
    prompt: "Set the spice jar on a thick live-edge black walnut board with visible bark edge in the background. Warm tungsten key light from camera-left (3200K) creating golden highlights on the wood grain and jar. A hand-forged chef's knife with patina lies diagonally behind the jar. Rumpled natural linen napkin tucked under the board's corner. Shallow depth of field at f/1.8—jar sharp, knife handle dissolving into creamy bokeh. Small pile of the actual spice blend spilled artfully in front of the jar. Mood: handcrafted, artisanal, worth the price. Style: Kinfolk magazine, farm-to-table premium." 
  },
  { 
    id: "hero-terracotta", 
    label: "Warm Terra", 
    category: "hero",
    prompt: "Place the spice jar on aged terracotta tiles with authentic patina and slight imperfections. Golden hour sunlight streaming from the right side, casting long warm shadows. A small dish of quality olive oil with a rosemary sprig floating in it sits beside the jar. Visible dust particles dancing in the light rays. Earthy color palette: terracotta, olive green, warm gold. Background suggests a Mediterranean kitchen window, soft and out of focus. Mood: sun-drenched, authentic, transporting. Style: Yotam Ottolenghi meets travel photography." 
  },
  { 
    id: "hero-concrete", 
    label: "Modern Concrete", 
    category: "hero",
    prompt: "Position the spice jar on a polished concrete surface with subtle aggregate visible. Cool, directional LED light from above creating crisp shadows. Minimalist styling: only the jar and a single fresh bay leaf placed precisely. Background is a soft grey gradient. Small reflection of the jar visible on the concrete surface. Color temperature: slightly cool 6000K for contemporary feel. Mood: modern, architectural, design-forward. Style: Aesop store aesthetic, Scandinavian minimalism. Sharp focus at f/5.6." 
  },

  // ═══════════════════════════════════════════════════════════════
  // LIFESTYLE — Aspiration triggers, "I want that life" moments
  // These sell the dream. The viewer inserts themselves into the scene.
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "kitchen-action", 
    label: "Chef's Hands", 
    category: "lifestyle",
    prompt: "The spice jar is being held by a chef's weathered, capable hands over a sizzling 12-inch cast iron skillet. Motion blur on the sprinkling action—spice particles frozen mid-fall by flash. Steam rising from the pan, dramatically backlit. Professional stainless steel kitchen environment soft in the background. The chef wears a clean white apron, only torso visible. Skillet contains searing ribeye with visible crust forming. Mood: expertise, action, restaurant-quality at home. Style: Bon Appétit action shot, documentary cooking. Shot at 1/250s with rear-curtain sync flash." 
  },
  { 
    id: "gather-table", 
    label: "Dinner Party", 
    category: "lifestyle",
    prompt: "The spice jar sits prominently on a abundant dinner table, surrounded by the feast. Shot from 45-degree overhead angle. Multiple hands reaching into frame—diverse skin tones—tearing bread, passing dishes. Warm candlelight mixed with blue-hour window light from behind. Natural linen tablecloth with authentic wrinkles. Half-full wine glasses catching light. Platters of roasted vegetables, a carved roast, fresh salads. The jar is in the power position—upper third, clearly the 'secret ingredient.' Mood: connection, abundance, celebration. Style: Minted dinner party, Anthropologie lifestyle." 
  },
  { 
    id: "grill-master", 
    label: "Backyard BBQ", 
    category: "lifestyle",
    prompt: "The spice jar on the wooden ledge of a well-used Weber kettle grill, lid open. Glowing orange charcoal embers visible inside, wisps of aromatic smoke rising. Thick-cut ribeyes on the grate showing perfect diamond grill marks. Magic hour lighting—warm sun from behind camera, creating rim light on the smoke. Blurred background shows string lights and a wooden fence. A cold beer bottle with condensation sits nearby. Mood: weekend freedom, mastery, summer evenings. Style: aspirational dad content, Traeger marketing. Shallow depth, jar sharp, grill slightly soft." 
  },
  { 
    id: "morning-ritual", 
    label: "Sunday Morning", 
    category: "lifestyle",
    prompt: "The spice jar on a rustic wooden breakfast tray, morning light streaming through sheer white curtains. The tray holds: two soft-boiled eggs in ceramic cups, thick-cut toast with butter, a small French press of coffee, and the jar. Crisp white linen bedding visible in the lower frame. A hand reaches in from the left to pick up the jar—natural, unpainted nails. Mood: slow living, self-care, weekend luxury. Style: Kinfolk morning, hygge lifestyle. Soft, diffused light, f/2.8, warm color grade 5800K." 
  },
  { 
    id: "outdoor-table", 
    label: "Al Fresco", 
    category: "lifestyle",
    prompt: "The spice jar on a weathered teak outdoor dining table. Long summer evening light casting everything in gold. The table is set for four: linen napkins, simple white plates, wine glasses filled with rosé. A large bowl of pasta salad glistens with olive oil. Lavender and olive trees soft in the background, suggesting Provence or Tuscany. A hand places the jar down, mid-motion. Mood: European summer, relaxed elegance, vacation. Style: Condé Nast Traveler food feature. Shot at f/4, background dreamy but recognizable." 
  },

  // ═══════════════════════════════════════════════════════════════
  // PROCESS — Trust builders, "they know what they're doing"
  // These establish credibility and craft. The viewer trusts the quality.
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "spice-market", 
    label: "Spice Souk", 
    category: "process",
    prompt: "The spice jar positioned in front of overflowing burlap sacks of whole spices in a traditional market setting. Shallow depth of field—jar tack-sharp, market scene becoming an impressionistic blur of turmeric yellows, paprika reds, and cumin browns. Warm ambient lighting suggesting covered bazaar. Brass scoops and hanging scales visible in the bokeh. A merchant's weathered hand gestures in the background. Mood: origin story, authenticity, global sourcing. Style: National Geographic food documentary, Steve McCurry color palette. The jar is the refined result of this raw abundance." 
  },
  { 
    id: "harvest-fresh", 
    label: "Farm Fresh", 
    category: "process",
    prompt: "The spice jar surrounded by just-harvested ingredients on a weathered farm table outdoors. Morning dew visible on herbs—basil, oregano, thyme still attached to stems. Heirloom tomatoes with imperfect shapes. Garlic bulbs with dirt still clinging. Natural outdoor light, slightly overcast for soft shadows. A greenhouse or garden rows visible soft in the background. The jar represents the elevated, finished product among raw ingredients. Mood: farm-to-table, organic, sustainable. Style: Whole Foods origin story, farmer's market premium." 
  },
  { 
    id: "mortar-craft", 
    label: "Hand Ground", 
    category: "process",
    prompt: "The spice jar beside a large granite mortar and pestle mid-grind. Whole spices—coriander seeds, cumin, dried chilies—scattered on an aged butcher block surface. Dramatic side lighting (raking light) revealing every texture: the granite's roughness, the wood's grain, the spice particles. Visible spice dust floating in a shaft of light. A craftsperson's hands grip the pestle, knuckles showing effort. The jar is the pristine result of this artisanal process. Mood: handcrafted, small-batch, labor of love. Style: documentary food photography, process journalism." 
  },
  { 
    id: "smoke-cure", 
    label: "Smokehouse", 
    category: "process",
    prompt: "The spice jar on a rough wooden shelf inside a traditional smokehouse. Strings of dried chilies and herb bundles hang from aged beams above. Shafts of light cut through aromatic smoke, creating visible god rays. Copper pots and cast iron implements in the shadows. Aged wood walls with authentic patina. The jar glows where the light hits it, a jewel in this rustic setting. Mood: heritage, tradition, time-honored methods. Style: bourbon distillery meets artisan food production. Warm color palette with deep shadows, 3200K." 
  },
  { 
    id: "blend-station", 
    label: "Blending Room", 
    category: "process",
    prompt: "The spice jar in a clean, professional spice blending environment. Stainless steel surfaces, glass jars of single-origin spices lined up precisely. A scale showing precise measurements. Small piles of individual spices arranged in a semicircle—the components before blending. Clean white lighting, almost laboratory precision. A person in a clean apron measures with focused attention in the background. Mood: precision, expertise, quality control. Style: craft production facility, behind-the-scenes premium brand content." 
  },

  // ═══════════════════════════════════════════════════════════════
  // CUISINE — Use-case triggers, "I'll make this tonight"
  // These show specific dishes. The viewer can taste it and wants to recreate.
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "taco-spread", 
    label: "Taco Night", 
    category: "cuisine",
    prompt: "The spice jar as the centerpiece of a vibrant taco night spread. Shot from above at 45 degrees. Warm corn tortillas in a cloth-lined basket. Small bowls containing: fresh pico de gallo, sliced radishes, crumbled cotija, pickled onions, lime wedges, fresh cilantro. A cast iron skillet with sizzling seasoned carne asada, steam rising. Colorful Talavera tiles as the surface. The jar's lid is off, a small spoon resting in it—clearly in use. Mood: festive, family, Friday night. Style: authentic Mexican home cooking, food blog hero. Warm lighting, appetite appeal maximized." 
  },
  { 
    id: "bbq-pit", 
    label: "Pitmaster BBQ", 
    category: "cuisine",
    prompt: "The spice jar on pink butcher paper next to thick-sliced Texas brisket showing a perfect smoke ring. An offset smoker visible in the soft background, smoke rising. The brisket glistens with rendered fat, bark perfectly black and crusty. White bread slices, pickles, and raw white onion rings arranged simply. A pitmaster's hand reaches for the jar—this is the secret rub. Wood smoke haze throughout the image. Mood: serious BBQ, competition-level, pitmaster credibility. Style: Texas Monthly BBQ photography, Aaron Franklin aesthetic. Outdoor natural light." 
  },
  { 
    id: "wok-fire", 
    label: "Wok Hei", 
    category: "cuisine",
    prompt: "The spice jar on the pass of a professional wok station. In the background, dramatic action: a wok over high flame, ingredients tossed mid-air, fire visible licking up the sides. Steam and wok hei smoke create atmosphere. The cook's arm shows motion blur from the toss. Stainless steel and tile environment of a real Chinese kitchen. The jar is in sharp focus in the foreground—the flavor secret. Mood: intense heat, authentic technique, street food energy. Style: action food photography, Lucky Peach aesthetic. High shutter speed freezing the toss, 1/1000s." 
  },
  { 
    id: "mediterranean-spread", 
    label: "Med Mezze", 
    category: "cuisine",
    prompt: "The spice jar among a Mediterranean mezze spread on a large olive wood board. Creamy hummus with a well of olive oil and paprika dusted on top. Baba ganoush, falafel, warm pita triangles, olives, feta cubes, cherry tomatoes. Fresh herbs scattered: mint, parsley, dill. The jar is being used—someone's hand drizzles olive oil while the other holds the jar, sprinkling. Outdoor setting, dappled sunlight through grape vines. Mood: sharing, abundance, healthy indulgence. Style: Ottolenghi cookbook, Israeli/Lebanese food photography." 
  },
  { 
    id: "pasta-finish", 
    label: "Pasta Moment", 
    category: "cuisine",
    prompt: "The spice jar beside a large pan of just-finished pasta—cacio e pepe or aglio e olio, glistening with olive oil and fresh pepper. Steam rising from the pan. Tongs mid-twirl, lifting a perfect portion. Parmesan wedge and microplane nearby. Simple setting: marble counter, copper pan, the jar. Someone's hand reaches for the jar to add the finishing touch. Mood: simple perfection, weeknight elevated, Italian soul. Style: Alison Roman aesthetic, NYT Cooking video still. Warm tungsten kitchen lighting, f/2.8." 
  },
  { 
    id: "breakfast-eggs", 
    label: "Perfect Eggs", 
    category: "cuisine",
    prompt: "The spice jar next to a cast iron skillet containing two perfect fried eggs—crispy edges, runny yolks, one yolk just broken and oozing gold. Thick-cut bacon alongside. A hand shakes the jar over the eggs, seasoning mid-action. Buttered sourdough toast on a small plate nearby. Morning light from a kitchen window. Simple wooden table surface. A coffee cup steams at the edge of frame. Mood: perfect morning, simple pleasures, everyday elevated. Style: food52 breakfast content, achievable luxury." 
  },

  // ═══════════════════════════════════════════════════════════════
  // SEASONAL — Urgency triggers, campaign-ready content
  // These have built-in timeliness. Use for seasonal marketing pushes.
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "summer-grill", 
    label: "Summer Cookout", 
    category: "seasonal",
    prompt: "The spice jar on a picnic table at a peak-summer backyard cookout. Red checkered cloth, corn on the cob with butter melting, watermelon wedges, a sweating pitcher of lemonade. A grill smokes in the background. Kids' legs run past in the blur. String lights ready for evening. Golden afternoon sun, lens flare acceptable. American flags or bunting subtle in the background. The jar is being passed between hands. Mood: Fourth of July, Memorial Day, summer freedom. Style: Coca-Cola Americana, nostalgic but fresh." 
  },
  { 
    id: "fall-harvest", 
    label: "Autumn Table", 
    category: "seasonal",
    prompt: "The spice jar surrounded by fall harvest abundance. Small pumpkins and gourds, root vegetables (carrots, parsnips, beets with greens attached), autumn leaves scattered naturally. Warm tungsten lighting mixed with cool window light suggesting overcast fall day. Chunky knit throw draped over a chair in the background. Cinnamon sticks and star anise as props near the jar. A Dutch oven of stew steams nearby. Mood: cozy, harvest, Thanksgiving prep. Style: Ina Garten fall episode, hygge comfort. Rich, warm color grade." 
  },
  { 
    id: "holiday-table", 
    label: "Holiday Feast", 
    category: "seasonal",
    prompt: "The spice jar in a position of honor on an elegant holiday table. Candlelight from tapered candles in brass holders. Evergreen sprigs and eucalyptus as table runner. A prime rib roast, perfectly crusted, as the centerpiece—the jar clearly used for the rub. Crystal wine glasses catching candlelight. Gold-rimmed china, linen napkins. Soft focus guests raising glasses in the background. Mood: celebration, tradition, premium gifting. Style: Williams-Sonoma holiday catalog, sophisticated not kitschy. Warm and cool light mixed." 
  },
  { 
    id: "winter-comfort", 
    label: "Winter Warmth", 
    category: "seasonal",
    prompt: "The spice jar beside a steaming Dutch oven of hearty stew or chili. Frost visible on a window in the background, warm interior contrasting with cold outside. A ladle lifts a portion, steam rising dramatically. Crusty bread torn open nearby. Cozy elements: a wool blanket draped on a chair, a crackling fire suggested by warm flickering light. The jar's lid is off, recently used. Mood: comfort, warmth against the cold, soul-satisfying. Style: Lodge cast iron marketing, January comfort content." 
  },
  { 
    id: "spring-fresh", 
    label: "Spring Garden", 
    category: "seasonal",
    prompt: "The spice jar on a garden potting bench surrounded by spring: seedlings in terracotta pots, fresh-cut herbs with roots still attached, a trowel with soil on it. Bright, clean spring sunlight. Light green color palette—new growth everywhere. A salad of spring greens, radishes, and herbs being dressed nearby. The jar adds flavor to the season's first harvest. Mood: renewal, fresh start, garden-to-table. Style: Martha Stewart spring issue, aspirational gardener content." 
  },

  // ═══════════════════════════════════════════════════════════════
  // SOCIAL — Platform-optimized, scroll-stopping, shareable
  // These are engineered for engagement. Thumb-stopping visuals.
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "flat-lay-clean", 
    label: "Perfect Flat Lay", 
    category: "social",
    prompt: "The spice jar at exact center of a perfectly symmetrical overhead flat lay. Pure white marble surface. Ingredients arranged in a precise circle around the jar: whole spices, fresh herbs, citrus slices, garlic cloves—each item placed with geometric intention. Strong shadows falling uniformly downward. Negative space in corners for text overlay. Color palette: the jar's label colors echoed in the ingredients. Mood: satisfying, organized, premium. Style: Instagram grid-worthy, influencer collaboration ready. Shot at f/8 for sharpness throughout, perfect exposure." 
  },
  { 
    id: "hand-held", 
    label: "In Good Hands", 
    category: "social",
    prompt: "The spice jar held in a naturally posed hand against a soft, blurred kitchen background. The hand is diverse-friendly, well-groomed but not overly manicured—relatable. Grip is casual, like mid-use. Warm, natural lighting from a window. The kitchen behind suggests a real home: wooden cutting board, a plant, copper pots. The jar is the sharp focus point, everything else falls off. Mood: authentic, relatable, real-person endorsement. Style: UGC aesthetic but professionally lit, Instagram Stories native." 
  },
  { 
    id: "pour-action", 
    label: "Seasoning Shot", 
    category: "social",
    prompt: "The spice jar tilted, spice blend pouring out in a dramatic stream. High-speed flash freezing individual particles mid-air. Clean black background for maximum contrast. The stream of spice catches dramatic side light, each particle glowing. The jar is held by a hand entering from the top of frame. A dish or pan below receives the seasoning, slightly out of focus. Mood: dynamic, satisfying, ASMR-visual. Style: slow-motion video still, TikTok scroll-stopper. Shot at 1/8000s with strobe, f/11." 
  },
  { 
    id: "before-after", 
    label: "The Difference", 
    category: "social",
    prompt: "Split composition: left side shows plain, unseasoned protein (chicken breast, steak) looking pale and unappetizing. Right side shows the same protein after seasoning with the jar—glistening, caramelized, appetizing. The spice jar sits at the dividing line, clearly the transformative element. Clean white cutting board surface. Even, bright lighting. The contrast is dramatic and undeniable. Mood: transformation, proof, before/after satisfaction. Style: infomercial elevated, comparison content for social." 
  },
  { 
    id: "recipe-card", 
    label: "Recipe Ready", 
    category: "social",
    prompt: "The spice jar photographed as if for a recipe card or Pinterest pin. Vertical 4:5 composition. The jar in the upper third with a finished dish below it—the recipe result. Clean, bright, airy lighting. Generous white space at top for recipe title text overlay. The dish is styled simply but appetizingly. A few raw ingredients scattered as supporting elements. Mood: helpful, saveable, actionable. Style: Pinterest-optimized, food blog hero, save-worthy content. Sharp focus, true colors, f/5.6." 
  },
  { 
    id: "unboxing", 
    label: "Just Arrived", 
    category: "social",
    prompt: "The spice jar emerging from branded packaging, unboxing moment. Tissue paper, a handwritten thank-you note visible, maybe a small recipe card. The jar is being lifted out by eager hands. Clean, bright setting—a kitchen counter or table. The packaging suggests premium: kraft paper, quality printing, attention to detail. Other jars peek out, suggesting a collection or gift set. Mood: anticipation, premium unboxing, gift-worthy. Style: subscription box reveal, influencer unboxing content." 
  },

  // ═══════════════════════════════════════════════════════════════
  // CUSTOM — Full creative control
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "custom", 
    label: "Custom Vision", 
    category: "custom",
    prompt: "" 
  },
];

/*
 * ═══════════════════════════════════════════════════════════════════════════════
 * PLATFORM FORMAT PRESETS
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Each platform has optimal dimensions for maximum engagement.
 * These are 2024 best practices—update annually as platforms evolve.
 */

const FORMAT_PRESETS = [
  // Instagram
  { id: "ig-square", label: "Instagram Square", platform: "instagram", ratio: "1:1", pixels: "1080×1080", desc: "Feed posts, carousels" },
  { id: "ig-portrait", label: "Instagram Portrait", platform: "instagram", ratio: "4:5", pixels: "1080×1350", desc: "Feed posts (more real estate)" },
  { id: "ig-story", label: "Instagram Story", platform: "instagram", ratio: "9:16", pixels: "1080×1920", desc: "Stories, Reels" },
  
  // Facebook
  { id: "fb-square", label: "Facebook Square", platform: "facebook", ratio: "1:1", pixels: "1080×1080", desc: "Feed posts" },
  { id: "fb-landscape", label: "Facebook Landscape", platform: "facebook", ratio: "1.91:1", pixels: "1200×628", desc: "Link shares, ads" },
  { id: "fb-story", label: "Facebook Story", platform: "facebook", ratio: "9:16", pixels: "1080×1920", desc: "Stories" },
  
  // TikTok
  { id: "tiktok", label: "TikTok", platform: "tiktok", ratio: "9:16", pixels: "1080×1920", desc: "Videos, stills" },
  
  // Pinterest
  { id: "pin-standard", label: "Pinterest Standard", platform: "pinterest", ratio: "2:3", pixels: "1000×1500", desc: "Standard pins" },
  { id: "pin-long", label: "Pinterest Long", platform: "pinterest", ratio: "1:2.1", pixels: "1000×2100", desc: "Infographics, recipes" },
  
  // Twitter/X
  { id: "twitter", label: "Twitter/X", platform: "twitter", ratio: "16:9", pixels: "1200×675", desc: "Timeline images" },
  
  // LinkedIn
  { id: "linkedin", label: "LinkedIn", platform: "linkedin", ratio: "1.91:1", pixels: "1200×628", desc: "Feed posts" },
  
  // YouTube
  { id: "youtube-thumb", label: "YouTube Thumbnail", platform: "youtube", ratio: "16:9", pixels: "1280×720", desc: "Video thumbnails" },
  
  // E-commerce
  { id: "shopify", label: "Shopify/Amazon", platform: "ecommerce", ratio: "1:1", pixels: "2048×2048", desc: "Product listings" },
  
  // Print/General
  { id: "print-4x6", label: "Print 4×6", platform: "print", ratio: "3:2", pixels: "1800×1200", desc: "Standard photo print" },
  { id: "print-5x7", label: "Print 5×7", platform: "print", ratio: "7:5", pixels: "2100×1500", desc: "Portrait print" },
];

export default function ImageEnhancerPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [sceneId, setSceneId] = useState<string>("hero-dark");
  const [activeCategory, setActiveCategory] = useState<string>("hero");
  const [customScene, setCustomScene] = useState<string>("");
  const [formatId, setFormatId] = useState<string>("ig-square");

  const activeFormat = useMemo(() => {
    return FORMAT_PRESETS.find((f) => f.id === formatId) || FORMAT_PRESETS[0];
  }, [formatId]);

  const activeScenePrompt = useMemo(() => {
    const basePrompt = sceneId === "custom" 
      ? customScene.trim()
      : SCENE_PRESETS.find((scene) => scene.id === sceneId)?.prompt ?? "";
    
    // Append format instructions to the prompt
    const formatInstruction = `Output image dimensions: ${activeFormat.ratio} aspect ratio (${activeFormat.pixels}). Compose the scene to work perfectly in this format with appropriate headroom and subject placement.`;
    
    return `${basePrompt} ${formatInstruction}`;
  }, [sceneId, customScene, activeFormat]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setEnhancedImage(null);
        setError(null);
        setApproved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const enhanceImage = async () => {
    if (!uploadedImage) return;

    setEnhancing(true);
    setError(null);
    setApproved(false);

    try {
      const settings = JSON.parse(localStorage.getItem('spicejax_settings') || '{}');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (settings.n8nUrl) headers['X-N8N-URL'] = settings.n8nUrl;
      if (settings.apiKey) headers['X-N8N-API-KEY'] = settings.apiKey;

      const payload = {
        image: uploadedImage,
        action: "enhance",
        sceneId,
        scenePrompt: activeScenePrompt,
      };

      const response = await fetch('/api/n8n/image-enhance', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success && data.enhancedImage) {
        setEnhancedImage(data.enhancedImage);
      } else {
        throw new Error(data.message || "Failed to enhance image");
      }
    } catch (err) {
      console.error("Enhancement error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setEnhancing(false);
    }
  };

  const handleDownload = () => {
    if (enhancedImage) {
      const link = document.createElement('a');
      link.href = enhancedImage;
      link.download = `spicejax-enhanced-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleApprove = async () => {
    if (!enhancedImage) return;
    setApproving(true);
    try {
      await fetch("/api/library/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enhancedImage,
          sceneId,
          scenePrompt: activeScenePrompt,
        }),
      });
      setApproved(true);
    } catch (err) {
      console.error("Failed to upload to library:", err);
    } finally {
      setApproving(false);
    }
  };

  return (
    <>
      <MainLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-rust to-rust-600 flex items-center justify-center shadow-lg shadow-brand-rust/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <p className="uppercase tracking-[0.3em] text-[10px] font-bold text-brand-rust">
                AI Studio
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Image Lab
            </h1>
            <p className="text-brand-text/70 mt-1">
              Transform product shots with AI-powered scene generation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left: Upload */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-brand-gold/20 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-brand-sage flex items-center justify-center border border-brand-gold/20">
                    <ImageIcon className="w-5 h-5 text-brand-text/50" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-text/50 uppercase tracking-wider">Step 01</p>
                    <h2 className="font-bold">Upload Original</h2>
                  </div>
                </div>

                {uploadedImage ? (
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-sage ring-1 ring-brand-gold/20">
                    <Image
                      src={uploadedImage}
                      alt="Original"
                      fill
                      className="object-contain p-4"
                    />
                    <button
                      onClick={() => {
                        setUploadedImage(null);
                        setEnhancedImage(null);
                        setApproved(false);
                      }}
                      className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center text-brand-text/50 hover:text-brand-rust hover:bg-rust-50 transition-colors shadow-lg border border-brand-gold/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-brand-gold/30 rounded-2xl cursor-pointer bg-brand-sage hover:border-brand-lime hover:bg-spice-50 transition-all group">
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-white group-hover:bg-brand-lime/10 flex items-center justify-center transition-colors border border-brand-gold/20">
                        <ImageIcon className="w-8 h-8 text-brand-text/30 group-hover:text-brand-lime transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-brand-title">Drop your image here</p>
                        <p className="text-sm text-brand-text/50 mt-1">or click to browse</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              {/* Scene Selection */}
              <div className="bg-white rounded-3xl border border-brand-gold/20 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6">
                <p className="text-sm font-bold text-brand-title mb-4">Choose a scene vibe</p>
                
                {/* Category Tabs */}
                <div className="flex gap-1 overflow-x-auto no-scrollbar pb-3 mb-4 border-b border-brand-gold/10">
                  {[
                    { id: "hero", label: "Hero", desc: "E-commerce ready" },
                    { id: "lifestyle", label: "Lifestyle", desc: "Aspirational" },
                    { id: "process", label: "Process", desc: "Trust builders" },
                    { id: "cuisine", label: "Cuisine", desc: "Use cases" },
                    { id: "seasonal", label: "Seasonal", desc: "Campaigns" },
                    { id: "social", label: "Social", desc: "Platform-ready" },
                    { id: "custom", label: "Custom", desc: "Your vision" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                        activeCategory === cat.id
                          ? "bg-[#243530] text-white"
                          : "text-brand-text/60 hover:text-brand-title hover:bg-brand-sage"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Scene Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {SCENE_PRESETS
                    .filter((scene) => scene.category === activeCategory)
                    .map((scene) => (
                      <button
                        key={scene.id}
                        onClick={() => setSceneId(scene.id)}
                        className={`px-3 py-3 rounded-xl text-sm font-medium text-left transition-all ${
                          sceneId === scene.id
                            ? "bg-[#243530] text-white shadow-lg"
                            : "bg-brand-sage text-brand-text hover:bg-spice-100 border border-transparent hover:border-brand-gold/20"
                        }`}
                      >
                        {scene.label}
                      </button>
                    ))}
                </div>

                {/* Selected Scene Preview */}
                {sceneId !== "custom" && (
                  <div className="mt-4 p-3 bg-brand-sage rounded-xl border border-brand-gold/10">
                    <p className="text-[10px] font-bold text-brand-text/40 uppercase tracking-wider mb-1">Scene Prompt</p>
                    <p className="text-xs text-brand-text/70 leading-relaxed">
                      {SCENE_PRESETS.find((s) => s.id === sceneId)?.prompt.slice(0, 120)}...
                    </p>
                  </div>
                )}

                {activeCategory === "custom" && (
                  <textarea
                    value={customScene}
                    onChange={(e) => {
                      setCustomScene(e.target.value);
                      setSceneId("custom");
                    }}
                    placeholder="Describe your exact vision... Be specific about lighting, props, mood, camera angle, and style references."
                    className="mt-4 w-full rounded-2xl border border-brand-gold/30 bg-brand-sage focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/20 text-sm p-4 transition-all"
                    rows={4}
                  />
                )}
              </div>

              {/* Format Selection */}
              <div className="bg-white rounded-3xl border border-brand-gold/20 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6">
                <p className="text-sm font-bold text-brand-title mb-4">Output format</p>
                
                {/* Platform Tabs */}
                <div className="flex gap-1 overflow-x-auto no-scrollbar pb-3 mb-4 border-b border-brand-gold/10">
                  {[
                    { id: "instagram", label: "Instagram", icon: "📸" },
                    { id: "facebook", label: "Facebook", icon: "📘" },
                    { id: "tiktok", label: "TikTok", icon: "🎵" },
                    { id: "pinterest", label: "Pinterest", icon: "📌" },
                    { id: "twitter", label: "X/Twitter", icon: "𝕏" },
                    { id: "ecommerce", label: "E-comm", icon: "🛒" },
                    { id: "print", label: "Print", icon: "🖨️" },
                  ].map((plat) => (
                    <button
                      key={plat.id}
                      onClick={() => {
                        const firstFormat = FORMAT_PRESETS.find((f) => f.platform === plat.id);
                        if (firstFormat) setFormatId(firstFormat.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                        activeFormat.platform === plat.id
                          ? "bg-[#243530] text-white"
                          : "text-brand-text/60 hover:text-brand-title hover:bg-brand-sage"
                      }`}
                    >
                      <span>{plat.icon}</span>
                      <span className="hidden sm:inline">{plat.label}</span>
                    </button>
                  ))}
                </div>

                {/* Format Options */}
                <div className="grid grid-cols-1 gap-2">
                  {FORMAT_PRESETS
                    .filter((f) => f.platform === activeFormat.platform)
                    .map((format) => (
                      <button
                        key={format.id}
                        onClick={() => setFormatId(format.id)}
                        className={`px-4 py-3 rounded-xl text-left transition-all flex items-center justify-between ${
                          formatId === format.id
                            ? "bg-[#243530] text-white shadow-lg"
                            : "bg-brand-sage text-brand-text hover:bg-spice-100 border border-transparent hover:border-brand-gold/20"
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-sm">{format.label}</p>
                          <p className={`text-xs mt-0.5 ${formatId === format.id ? "text-white/60" : "text-brand-text/50"}`}>
                            {format.desc}
                          </p>
                        </div>
                        <div className={`text-right ${formatId === format.id ? "text-white/80" : "text-brand-text/40"}`}>
                          <p className="text-xs font-mono">{format.ratio}</p>
                          <p className="text-[10px] font-mono">{format.pixels}</p>
                        </div>
                      </button>
                    ))}
                </div>

                {/* Format Preview */}
                <div className="mt-4 flex items-center gap-3 p-3 bg-brand-sage rounded-xl border border-brand-gold/10">
                  <div 
                    className="bg-[#243530] rounded flex-shrink-0 flex items-center justify-center text-white/30 text-[8px] font-mono"
                    style={{
                      width: activeFormat.ratio === "1:1" ? 40 : 
                             activeFormat.ratio === "4:5" ? 32 :
                             activeFormat.ratio === "9:16" ? 24 :
                             activeFormat.ratio === "16:9" ? 48 :
                             activeFormat.ratio === "2:3" ? 28 :
                             activeFormat.ratio === "1:2.1" ? 20 :
                             activeFormat.ratio === "1.91:1" ? 48 :
                             activeFormat.ratio === "3:2" ? 42 :
                             activeFormat.ratio === "7:5" ? 38 : 40,
                      height: activeFormat.ratio === "1:1" ? 40 :
                              activeFormat.ratio === "4:5" ? 40 :
                              activeFormat.ratio === "9:16" ? 42 :
                              activeFormat.ratio === "16:9" ? 27 :
                              activeFormat.ratio === "2:3" ? 42 :
                              activeFormat.ratio === "1:2.1" ? 42 :
                              activeFormat.ratio === "1.91:1" ? 25 :
                              activeFormat.ratio === "3:2" ? 28 :
                              activeFormat.ratio === "7:5" ? 27 : 40,
                    }}
                  >
                    {activeFormat.ratio}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-brand-title">{activeFormat.label}</p>
                    <p className="text-[10px] text-brand-text/50">{activeFormat.pixels} • {activeFormat.desc}</p>
                  </div>
                </div>
              </div>

              {/* Enhance Button */}
              <button
                onClick={enhanceImage}
                disabled={!uploadedImage || enhancing}
                className="w-full py-4 bg-gradient-to-r from-brand-title to-brand-black text-white font-bold text-lg rounded-2xl hover:from-brand-black hover:to-brand-title disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-title/20 disabled:shadow-none"
              >
                {enhancing ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Generating Scene…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Run Enhancement
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-rust-50 text-brand-rust rounded-2xl border border-brand-rust/20 text-sm">
                  ⚠️ {error}
                </div>
              )}
            </div>

            {/* Right: Result */}
            <div className="bg-white rounded-3xl border border-brand-gold/20 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-lime to-spice-600 flex items-center justify-center shadow-lg shadow-brand-lime/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-text/50 uppercase tracking-wider">Step 02</p>
                  <h2 className="font-bold">Enhanced Result</h2>
                </div>
              </div>

              {enhancedImage ? (
                <div className="flex-1 flex flex-col gap-4">
                  <div className="relative flex-1 min-h-[400px] rounded-2xl overflow-hidden bg-brand-sage">
                    <Image
                      src={enhancedImage}
                      alt="Enhanced"
                      fill
                      className="object-cover"
                    />
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1.5 bg-brand-lime text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        ENHANCED
                      </span>
                    </div>
                    {approved && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1.5 bg-white text-brand-lime text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5 border border-brand-lime/20">
                          <Check className="w-3 h-3" />
                          SAVED
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsPreviewOpen(true)}
                        className="w-11 h-11 flex items-center justify-center rounded-xl border border-brand-gold/30 text-brand-text hover:bg-brand-sage hover:border-brand-gold transition-all"
                        title="Preview"
                      >
                        <Expand className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleDownload}
                        className="w-11 h-11 flex items-center justify-center rounded-xl bg-brand-title text-white hover:bg-brand-black transition-all shadow-lg"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setEnhancedImage(null);
                          setApproved(false);
                        }}
                        className="w-11 h-11 flex items-center justify-center rounded-xl border border-brand-gold/30 text-brand-text/50 hover:text-brand-rust hover:border-brand-rust/30 hover:bg-rust-50 transition-all"
                        title="Discard"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={handleApprove}
                      disabled={approving || approved}
                      className={`flex-1 min-w-[160px] py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        approved
                          ? "bg-spice-50 text-brand-title border border-brand-lime/30"
                          : "bg-gradient-to-r from-brand-lime to-spice-600 text-white shadow-lg shadow-brand-lime/30 hover:shadow-xl hover:shadow-brand-lime/40 disabled:opacity-50"
                      }`}
                    >
                      {approved ? (
                        <>
                          <Check className="w-4 h-4" />
                          Saved to Library
                        </>
                      ) : approving ? (
                        "Saving..."
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Approve & Save
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-brand-text/50 bg-brand-sage rounded-2xl border-2 border-dashed border-brand-gold/20">
                  {enhancing ? (
                    <div className="text-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-brand-rust/20 rounded-full blur-2xl animate-pulse"></div>
                        <div className="relative text-6xl animate-bounce">🪄</div>
                      </div>
                      <p className="font-semibold text-brand-title">Creating magic...</p>
                      <p className="text-sm mt-1">AI is building your scene</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mx-auto mb-4 border border-brand-gold/20">
                        <ImageIcon className="w-10 h-10 text-brand-text/20" />
                      </div>
                      <p className="font-semibold text-brand-title">No result yet</p>
                      <p className="text-sm mt-1">Upload an image and hit enhance</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>

      {/* Preview Modal */}
      {isPreviewOpen && enhancedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/90 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl p-6 overflow-hidden border border-brand-gold/20">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-brand-sage text-brand-text hover:bg-rust-50 hover:text-brand-rust transition-colors z-10 border border-brand-gold/20"
            >
              <X className="w-5 h-5" />
            </button>
            <Zoom zoomMargin={32}>
              <div
                className="relative w-full rounded-2xl overflow-hidden bg-brand-sage"
                style={{ aspectRatio: "3 / 4", maxHeight: "75vh", margin: "0 auto" }}
              >
                <Image
                  src={enhancedImage}
                  alt="Enhanced preview"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Zoom>
            <p className="text-sm text-brand-text/50 text-center mt-4">
              Click to zoom • Scroll to inspect details
            </p>
          </div>
        </div>
      )}
    </>
  );
}
