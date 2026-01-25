"use client";

import { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/MainLayout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Expand, Download, Trash2, Sparkles, ImageIcon, Check, X, Flame, PenTool } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { getProducts, type SpiceProduct } from "@/lib/products";
import { getSettings } from "@/lib/settings";

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
  // PREMIUM — Over-the-top editorial, award-winning, showstopper shots
  // These are your "make them stop scrolling" images. Magazine covers.
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "levitation", 
    label: "Levitation", 
    category: "premium",
    prompt: "The spice jar floating in mid-air, defying gravity, surrounded by a dynamic explosion of its contents—individual spice particles, herbs, and ingredients suspended in perfect frozen motion around it. Ultra high-speed photography aesthetic, 1/10000s freeze. Dramatic rim lighting from behind creating halos around each floating element. Deep black background for maximum contrast. Every particle sharp and defined. The jar rotates slightly, catching light on its edge. Mood: magic, impossibility, premium advertising. Style: Hasselblad H6D, Phase One, Super Bowl commercial quality. This is the hero shot that wins awards." 
  },
  { 
    id: "splash", 
    label: "Liquid Splash", 
    category: "premium",
    prompt: "The spice jar at the center of a dramatic liquid splash—olive oil or honey creating a perfect crown splash around the base, frozen at the peak moment. Individual droplets suspended in air, catching light like liquid gold. The jar remains pristine and sharp while chaos erupts around it. Dramatic side lighting creating reflections in every droplet. Dark moody background. High-speed flash photography, 1/8000s. Mood: dynamic, premium, appetite appeal. Style: Broncolor advertising photography, food commercial hero shot. Print-ad worthy." 
  },
  { 
    id: "smoke-art", 
    label: "Smoke Dance", 
    category: "premium",
    prompt: "The spice jar surrounded by ethereal, sculpted smoke forming beautiful organic shapes—wisps curling and dancing around the product like living art. The smoke is backlit, creating depth and dimension, some areas glowing warmly. The jar is tack-sharp, the smoke soft and dreamlike. Deep shadows, selective lighting only on the jar and smoke edges. Long exposure smoke art combined with flash-frozen product. Mood: mysterious, artistic, gallery-worthy. Style: fine art product photography, museum exhibition quality." 
  },
  { 
    id: "ingredient-explosion", 
    label: "Ingredient Burst", 
    category: "premium",
    prompt: "The spice jar with a spectacular explosion of whole ingredients bursting outward in all directions—dried chilies, peppercorns, garlic cloves, herb leaves, citrus zest, all frozen in a perfect radial burst pattern. Each ingredient lit individually, colors vibrant and saturated. The jar at the calm center of the storm, label clearly visible. Pure black background. Composite photography technique, each element perfectly placed. Mood: abundance, flavor explosion, sensory overload. Style: Modernist Cuisine photography, Nathan Myhrvold aesthetic." 
  },
  { 
    id: "mirror-world", 
    label: "Mirror Reflection", 
    category: "premium",
    prompt: "The spice jar on a flawless black mirror surface creating a perfect reflection below—the reflection subtly distorted by a thin layer of water creating gentle ripples. Symmetrical composition, the jar and its reflection forming a complete visual. Single dramatic light source from above-left. Minimal styling, maximum impact. The surface extends to infinity, no visible edges. Mood: luxury, perfection, high-end retail. Style: Cartier jewelry advertising, luxury brand campaign. Absolute precision." 
  },
  { 
    id: "fire-ring", 
    label: "Ring of Fire", 
    category: "premium",
    prompt: "The spice jar surrounded by a perfect ring of real fire—flames dancing in a controlled circle around the product, creating warmth and drama. The jar is untouched by the flames, sitting calmly at the center. Fire reflects on the dark surface below. Smoke rises and curls above. The heat is palpable, the spice connection obvious. Long exposure for flame movement, flash freeze on the jar. Mood: heat, intensity, bold flavor. Style: high-end hot sauce advertising, dramatic food photography." 
  },
  { 
    id: "botanical-art", 
    label: "Botanical Study", 
    category: "premium",
    prompt: "The spice jar as the centerpiece of an elaborate botanical arrangement—fresh and dried herbs, edible flowers, whole spices, and ingredients arranged with scientific precision like a vintage botanical illustration come to life. Overhead shot, symmetrical arrangement radiating outward from the jar. Each element labeled with elegant typography in the style of old apothecary drawings. Soft, even lighting, muted earth tones with pops of color. Mood: educational, artisanal, heritage. Style: Taschen botanical book, natural history museum exhibit." 
  },
  { 
    id: "crystal-cave", 
    label: "Crystal Formation", 
    category: "premium",
    prompt: "The spice jar nestled among dramatic salt crystals and mineral formations—large pink Himalayan salt crystals, black lava salt formations, white fleur de sel clusters. The jar emerges from this crystalline landscape like a discovered treasure. Dramatic side lighting making crystals glow and sparkle. Cave-like atmosphere, mysterious and premium. Macro detail on crystal structures. Mood: precious, geological, rare. Style: National Geographic meets luxury advertising, discovery aesthetic." 
  },
  { 
    id: "noir-cinema", 
    label: "Film Noir", 
    category: "premium",
    prompt: "The spice jar in a dramatic film noir scene—harsh shadows from venetian blinds cutting across the frame, the jar sitting on a dark wooden surface, a shaft of light illuminating just the label. Black and white with subtle sepia toning. Smoke or steam drifting through the light beams. Cinematic 2.39:1 aspect ratio feel. A vintage chef's knife in the shadows. Mood: mysterious, classic, timeless. Style: 1940s Hollywood cinematography, Citizen Kane lighting, Roger Deakins aesthetic." 
  },
  { 
    id: "frozen-time", 
    label: "Frozen Moment", 
    category: "premium",
    prompt: "The spice jar captured at the exact moment of seasoning—a hand tilts the jar, and a stream of spice blend is frozen mid-pour, each granule individually visible, suspended in time. The receiving dish below shows the beginning of the pile forming. Ultra-macro detail, you can see the texture of individual spice particles. Time has stopped. Dramatic lighting catches each falling piece. Mood: precision, the perfect moment, culinary artistry. Style: Harold Edgerton high-speed photography, MIT strobe lab aesthetic." 
  },
  { 
    id: "golden-hour-hero", 
    label: "Golden Hour Glory", 
    category: "premium",
    prompt: "The spice jar bathed in the most perfect golden hour light imaginable—warm, honeyed sunlight streaming through a window, dust particles floating in the beams like gold flakes. The jar glows with warmth, casting a long dramatic shadow. A simple rustic surface, perhaps aged wood or linen. Everything else falls away—this is product worship. Lens flare acceptable, even desirable. Mood: warmth, home, the golden moment. Style: Terrence Malick cinematography, magic hour perfection." 
  },
  { 
    id: "deconstructed", 
    label: "Deconstructed", 
    category: "premium",
    prompt: "The spice jar shown deconstructed—the jar, lid, label, and contents all separated and floating in space in an exploded view diagram style. Each component casting its own shadow on a white background. Technical precision meets artistic arrangement. Small piles of individual spices that make up the blend arranged below with tiny labels. Mood: transparency, craftsmanship, nothing to hide. Style: Apple product photography meets culinary art, Dieter Rams aesthetic." 
  },

  // ═══════════════════════════════════════════════════════════════
  // E-COMMERCE — Marketplace-ready, compliance-focused
  // These are your bread-and-butter product images for online sales.
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "amazon-white", 
    label: "Amazon Pure White", 
    category: "ecommerce",
    prompt: "The spice jar on pure white (#FFFFFF) seamless background, perfectly centered in frame. Product fills exactly 85% of the image area per Amazon requirements. Even, shadowless lighting from a light tent or multiple softboxes eliminating all shadows. Label facing camera at subtle 15-degree angle to show dimension without losing readability. Color-accurate with no color cast. Tack-sharp from front label to back edge at f/11. No props, no shadows, no reflections, no distractions. This is pure product, nothing else. Style: Amazon main image compliant, professional e-commerce. Must pass Amazon's white background checker." 
  },
  { 
    id: "ecom-angle", 
    label: "3/4 Product View", 
    category: "ecommerce",
    prompt: "The spice jar photographed at classic 3/4 angle—showing both front label and side simultaneously. Pure white background, soft gradient shadow falling naturally below. Professional product lighting: main light from upper-right, fill from left, slight rim light separating product from background. Every detail of the label crisp and readable. The jar's glass catches subtle highlights showing quality. Shot at f/8 for complete sharpness. Style: WooCommerce product gallery, professional catalog photography. Secondary e-commerce image showing product dimension." 
  },
  { 
    id: "ecom-scale", 
    label: "Size Reference", 
    category: "ecommerce",
    prompt: "The spice jar positioned next to common kitchen objects for size reference—a fresh lemon, a large egg, or a standard soup spoon. Clean white marble or light wood surface. Soft, even lighting. The comparison objects are universally recognized, making the jar's size immediately clear. Minimal styling, maximum clarity. Label clearly visible. Customers need to know what they're getting. Style: honest product photography, size comparison shot. Builds trust through transparency." 
  },
  { 
    id: "ecom-macro", 
    label: "Spice Texture", 
    category: "ecommerce",
    prompt: "Extreme macro close-up of the actual spice blend texture—you can see individual flakes of sea salt, specks of dried herbs, granules of garlic, flecks of chili. The jar sits soft in the background, slightly out of focus. A small pile of the blend on a dark slate surface, dramatically lit from the side to reveal every particle's texture and color variation. Sharp focus at f/16, focus-stacked if needed. Mood: quality ingredients, nothing to hide, artisan detail. Style: ingredient hero shot, quality proof, macro food photography." 
  },
  { 
    id: "ecom-label", 
    label: "Label Detail", 
    category: "ecommerce",
    prompt: "The spice jar label in perfect focus—every word readable, every design element crisp. Shot straight-on to avoid distortion. Neutral lighting preserving true colors. The ingredients list, nutrition facts, and brand logo all clearly visible. Clean background that doesn't compete. This is the shot that answers customer questions about what's inside. Shot at f/8, color-calibrated display. Style: informational product photography, building trust through transparency." 
  },
  { 
    id: "ecom-lifestyle", 
    label: "Kitchen Context", 
    category: "ecommerce",
    prompt: "The spice jar in a clean, aspirational but realistic kitchen setting. White quartz countertop, a few quality props (copper measuring spoons, fresh herbs in a glass, wooden cutting board edge). Natural window light from the side. The jar is clearly the subject but shown in context of where it will live. Not overly styled—believable, achievable. Label visible, product dominant. Mood: this belongs in your kitchen. Style: Etsy listing hero, lifestyle e-commerce, attainable aspiration." 
  },

  // ═══════════════════════════════════════════════════════════════
  // SIGNATURE — Product-specific scenes for each SpiceJax blend
  // These scenes are tailored to each product's cultural roots and best uses.
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "birria-drip", 
    label: "Birria Drip", 
    category: "signature",
    prompt: "The Birria Fiesta jar beside the money shot: a quesabirria being dipped into a bowl of rich, brick-red consomé. Cheese stretching dramatically, broth splashing slightly on impact. The tortilla shows perfect golden-brown crispy edges. Traditional Mexican clay bowl (barro) for the consomé, glossy with rendered fat floating on top. Fresh lime wedges, roughly chopped cilantro, diced white onion in small bowls. Steam rises from the broth. The jar sits with lid off, a small spoon inside showing recent use. Warm tungsten lighting suggesting a taquería at night. Mood: authentic street food, craveable, the real deal. Style: Mexican food blog hero, Tijuana taco stand documentary." 
  },
  { 
    id: "birria-tacos", 
    label: "Taco Spread", 
    category: "signature",
    prompt: "The Birria Fiesta jar as centerpiece of an authentic birria taco spread. Three tacos arranged on a worn metal tray—corn tortillas dipped in consomé and griddled crispy, filled with tender shredded beef, topped with cilantro and onion. A bowl of consomé for dipping with visible chile oil floating on top. Radish slices, lime wedges, pickled jalapeños. The jar prominently placed, lid removed, showing this is the secret. Colorful Talavera tile surface. Warm, saturated colors—reds, oranges, greens. Mood: Friday night tacos, family gathering, authentic Mexican. Style: Serious Eats taco feature, Rick Bayless cookbook." 
  },
  { 
    id: "nashville-hot", 
    label: "Nashville Hot", 
    category: "signature",
    prompt: "The Nashville Heat jar beside a towering Nashville hot chicken sandwich—aggressively crispy, cayenne-red fried chicken breast on plain white bread (traditional style) with thick-cut pickle chips. The chicken glistens with spicy oil, you can feel the heat. A drizzle of honey falling from above, catching the light like liquid gold. Red-and-white checkered paper in a wire basket. Neon sign glow in the background—hot pink and electric blue suggesting a late-night Nashville spot. The jar sits open, clearly just used for the deadly coating. Mood: cult-level heat, Southern indulgence, no regrets. Style: Hattie B's aesthetic, Nashville food scene, late-night cravings." 
  },
  { 
    id: "nashville-tenders", 
    label: "Hot Tenders", 
    category: "signature",
    prompt: "The Nashville Heat jar beside a basket of Nashville hot chicken tenders—five pieces of crispy, fiery chicken arranged on parchment. The coating is deep crimson, oil beading on the surface. A side of creamy ranch for cooling. Crinkle-cut pickles, white bread slices to soak up the drippings. The jar positioned as the secret weapon. Casual diner setting—formica table, red vinyl booth edge visible. Harsh, honest lighting like a real chicken joint. Mood: serious heat challenge, worth the pain, legendary. Style: Hot Ones episode, Nashville dive bar, heat seekers welcome." 
  },
  { 
    id: "shichimi-ramen", 
    label: "Ramen Bowl", 
    category: "signature",
    prompt: "The Shichimi Togarashi jar beside a steaming bowl of tonkotsu ramen—rich, creamy pork broth with perfect toppings: soft-boiled egg sliced to show the jammy orange center, two slices of torched chashu pork, crisp nori sheets standing upright, thin-sliced green onions, a swirl of black garlic oil. Chopsticks lifting a tangle of wavy noodles, steam rising. The jar is being shaken over the bowl—red and orange particles falling through steam. Japanese ceramic bowl, dark wood counter, minimal styling. Mood: umami depth, Japanese precision, warming soul food. Style: Tokyo ramen shop at midnight, Ivan Ramen aesthetic, Monocle Japan feature." 
  },
  { 
    id: "shichimi-rice", 
    label: "Japanese Rice Bowl", 
    category: "signature",
    prompt: "The Shichimi Togarashi jar beside a perfect Japanese rice bowl—steaming short-grain rice topped with a raw egg yolk, toasted sesame, nori strips, and a generous shake of shichimi. Chopsticks rest on a ceramic hashioki. Small dishes of pickled vegetables and miso soup accompany. The jar is open, recently used, particles visible on the rice surface. Traditional Japanese table setting—wood, ceramic, clean lines. Soft, natural light from a shoji screen. Mood: simple perfection, Japanese home cooking, tamago gohan. Style: Haruki Murakami novel food scene, minimal Japanese aesthetic." 
  },
  { 
    id: "habanero-wings", 
    label: "Honey Hab Wings", 
    category: "signature",
    prompt: "The Smokey Honey Habanero jar beside a pile of glazed chicken wings—glistening with sticky honey-habanero glaze, char marks from the grill, sesame seeds scattered on top. The glaze drips and pools on the plate. A small bowl of blue cheese dressing with celery sticks. The wings are piled high on a rustic wooden board. Orange and mango slices as garnish hint at tropical heat. Warm, golden lighting suggesting Caribbean vibes. The jar sits open, glaze visibly made with it. Mood: sweet heat, addictive, finger-licking. Style: Caribbean beach bar, tropical heat, island vibes meet American wings." 
  },
  { 
    id: "habanero-tropical", 
    label: "Tropical Heat", 
    category: "signature",
    prompt: "The Smokey Honey Habanero jar in a tropical setting—beside grilled pineapple slices with char marks, mango chunks, fresh habanero peppers (orange and red), lime halves, and coconut flakes. A jerk chicken thigh, perfectly blackened, shows the rub in action. Palm leaf or banana leaf as a natural plate. Bright, saturated colors—the jar pops against tropical yellows and oranges. Outdoor feeling, maybe beach or patio. The jar's smokiness meets island sweetness. Mood: vacation flavors, Caribbean escape, sweet fire. Style: Jamaican food photography, tropical resort menu." 
  },
  { 
    id: "chipotle-ribs", 
    label: "BBQ Ribs", 
    category: "signature",
    prompt: "The Honey Chipotle jar beside a rack of perfectly smoked baby back ribs—mahogany bark, meat pulling away from the bone, glaze glistening. The ribs sit on a worn wooden cutting board with a cleaver beside them. Classic BBQ sides in small bowls: creamy coleslaw, baked beans, corn on the cob with butter. A squeeze bottle of extra glaze. The jar is the dry rub secret, positioned proudly. Outdoor smoker visible soft in background, smoke wisping. Red checkered napkin. Mood: backyard pitmaster, low and slow, BBQ competition worthy. Style: Texas Monthly BBQ issue, American smokehouse." 
  },
  { 
    id: "chipotle-burger", 
    label: "Smash Burger", 
    category: "signature",
    prompt: "The Honey Chipotle jar beside a double smash burger—two thin, crispy-edged patties with melted American cheese, caramelized onions, pickles, chipotle aioli dripping down. The bun is soft, slightly squished. Crinkle-cut fries scattered around. The jar sits open—the rub was mixed into the beef. A cold beer bottle with condensation nearby. Classic diner surface—stainless steel or formica. Harsh, honest lighting. The burger is messy, real, irresistible. Mood: cheat day, no regrets, American classic elevated. Style: George Motz burger documentary, Shake Shack energy." 
  },

  // ═══════════════════════════════════════════════════════════════
  // BUNDLE — Multi-product, collection, and gift shots
  // Showcase the full SpiceJax family together.
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "full-collection", 
    label: "The Full Lineup", 
    category: "bundle",
    prompt: "All five SpiceJax jars arranged in a dramatic lineup—Birria Fiesta, Nashville Heat, Shichimi Togarashi, Smokey Honey Habanero, and Honey Chipotle BBQ. Arranged by heat level from mild to hot, left to right. Each jar at a slightly different angle for visual interest. Dark, moody background (black slate or dark wood). Dramatic side lighting creating highlights on glass and deep shadows. Small piles of each blend's signature ingredients in front of their respective jars. Mood: the complete arsenal, serious flavor collection. Style: craft beer flight aesthetic, premium product lineup, collector's display." 
  },
  { 
    id: "heat-scale", 
    label: "Heat Scale", 
    category: "bundle",
    prompt: "All five SpiceJax jars arranged in ascending heat order with visual heat indicators—flames or chili peppers increasing in intensity from left to right. Birria Fiesta (1🔥) to Nashville Heat (4🔥). Clean white background with subtle gradient. Each jar perfectly lit, labels readable. Small flame icons or fresh chili peppers arranged below each jar indicating heat level. The progression tells a story—find your comfort zone. Mood: helpful guide, heat challenge, something for everyone. Style: infographic meets product photography, educational but premium." 
  },
  { 
    id: "gift-box", 
    label: "Gift Set", 
    category: "bundle",
    prompt: "All five SpiceJax jars nestled in a premium gift box—kraft paper exterior, tissue paper nest, each jar visible and perfectly arranged. A handwritten thank-you card peeks out. Satin ribbon untied, lid beside the box. One jar being lifted out by eager hands. Morning light on a clean white marble surface. The presentation is premium but warm—gift-worthy without being stuffy. Maybe a small recipe card visible. Mood: perfect gift, unboxing joy, foodie Christmas morning. Style: subscription box reveal, premium gifting, holiday catalog hero." 
  },
  { 
    id: "starter-kit", 
    label: "Starter Kit", 
    category: "bundle",
    prompt: "Three SpiceJax jars (curated selection) arranged as a 'starter kit' with cooking tools—a quality wooden spoon, a small cast iron skillet, and a linen towel. Clean, aspirational kitchen surface. The jars represent variety: one mild, one medium, one hot. A recipe card shows suggested first dishes to try. Mood: great first purchase, gateway to flavor, gift for the aspiring cook. Style: cooking class starter pack, Williams-Sonoma gift guide, beginner-friendly but premium." 
  },

  // ═══════════════════════════════════════════════════════════════
  // VIDEO — Optimized for thumbnails, reels, TikTok hooks
  // These compositions are designed for 0.5-second scroll-stopping.
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "thumb-split", 
    label: "Before/After Split", 
    category: "video",
    prompt: "Dramatic split-screen composition: LEFT side shows sad, pale, unseasoned chicken breast—flat lighting, washed out, unappetizing. RIGHT side shows the same chicken after SpiceJax—golden brown, glistening, caramelized, steam rising, absolutely craveable. The spice jar sits exactly at the dividing line, clearly the transformative element. High contrast, bold colors. The difference is undeniable and dramatic. Text space at top for 'BEFORE | AFTER' overlay. Mood: transformation proof, undeniable results. Style: infomercial elevated, social proof content, scroll-stopping comparison." 
  },
  { 
    id: "thumb-drip", 
    label: "Money Shot Drip", 
    category: "video",
    prompt: "The ultimate food porn moment: cheese pulling in a long stretch, or sauce dripping in slow motion, or yolk breaking and flowing like liquid gold—with the SpiceJax jar clearly visible in frame. Frozen at the perfect moment of maximum appetite appeal. Dark background for contrast. The jar is sharp and prominent, the drip/pull is the hero action. Bold, high-saturation colors. Mood: craveable, ASMR visual, save this recipe. Style: TikTok food account hero shot, Tasty video thumbnail, 2M views energy." 
  },
  { 
    id: "thumb-fire", 
    label: "Flames & Heat", 
    category: "video",
    prompt: "The SpiceJax jar (Nashville Heat or Smokey Honey Habanero) with real flames visible—either from a grill flare-up behind it or a dramatic flame burst. The jar appears to be emerging from or surrounded by fire. Dramatic, high-contrast lighting. Deep blacks, bright oranges and reds. Sparks or embers floating. Text space for '🔥 EXTREME HEAT WARNING 🔥' overlay. Mood: dangerous heat, challenge accepted, viral potential. Style: Hot Ones challenge, extreme food content, heat warning clickbait (the good kind)." 
  },
  { 
    id: "thumb-reaction", 
    label: "Reaction Ready", 
    category: "video",
    prompt: "The SpiceJax jar beside a finished dish, composed with deliberate empty space on one side—room for a face/reaction overlay or text. The dish is steaming, craveable, perfect. High contrast, saturated colors that pop on mobile. The jar is prominent but not centered, following the rule of thirds for overlay space. Clean background that won't compete with text or faces. Mood: duet-ready, reaction video setup. Style: TikTok native composition, made for stitches and duets." 
  },
  { 
    id: "thumb-reveal", 
    label: "Lid Lift Reveal", 
    category: "video",
    prompt: "A hand lifting the lid off a pot or pan, steam dramatically billowing out to reveal a perfectly cooked dish inside—the big reveal moment. The SpiceJax jar sits beside the pot, clearly used. Dramatic backlighting on the steam. The dish inside is the payoff: perfectly braised meat, bubbling stew, or caramelized vegetables. Frozen at peak reveal moment. Mood: the big reveal, cooking payoff, worth the wait. Style: cooking video climax frame, thumbnail bait, 'wait for it' energy." 
  },

  // ═══════════════════════════════════════════════════════════════
  // UGC — User-generated content aesthetic, authentic and relatable
  // These look like real customers shot them (but better).
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "ugc-kitchen", 
    label: "Real Kitchen", 
    category: "ugc",
    prompt: "The SpiceJax jar in a real, lived-in kitchen—not a styled set, but an actual home. Some dishes in the sink (not gross, just real), a plant on the windowsill, maybe a kids' drawing on the fridge. The jar sits on the counter being used in actual cooking. Natural window light, slightly imperfect exposure like a phone camera. The cook's hands are in frame, doing something real. Mood: this could be your kitchen, authentic use, relatable. Style: UGC aesthetic, Instagram stories native, real person energy." 
  },
  { 
    id: "ugc-unbox", 
    label: "Just Arrived", 
    category: "ugc",
    prompt: "First-person POV: hands opening a SpiceJax package just delivered. The shipping box is open, packing material visible, the jar being lifted out for the first time. Kitchen counter or table as surface. Natural light. The excitement of receiving an order. Maybe a phone visible suggesting they're about to take a photo. Mood: unboxing excitement, just got mine, can't wait to try. Style: customer photo aesthetic, real delivery moment, shareable excitement." 
  },
  { 
    id: "ugc-plate", 
    label: "My Dinner", 
    category: "ugc",
    prompt: "Overhead phone-camera angle of a home-cooked meal with the SpiceJax jar visible at the edge of frame—the classic 'made dinner tonight' social post. The food is good but not overly styled—real portion on a real plate. Maybe a fork already cutting in. Natural home lighting, slight warmth. The jar is there almost casually, like 'oh yeah, used this.' Mood: weeknight dinner, made this myself, home cooking win. Style: Instagram food post, Stories share, relatable home chef." 
  },
  { 
    id: "ugc-action", 
    label: "Cooking Moment", 
    category: "ugc",
    prompt: "Mid-cooking action shot taken by a friend or partner—the cook is seasoning food with the SpiceJax jar, caught in a candid moment. Slight motion blur acceptable. Steam rising from the pan. The kitchen is real, the moment is authentic. Natural light mixed with stove light. The cook might be laughing or focused. Mood: caught in the act, real cooking, behind the scenes. Style: boyfriend/girlfriend took this, candid cooking, authentic moment." 
  },

  // ═══════════════════════════════════════════════════════════════
  // RECIPE — Tutorial and blog-ready compositions
  // These are made for Pinterest saves and recipe card headers.
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "recipe-ingredients", 
    label: "Ingredients Flat Lay", 
    category: "recipe",
    prompt: "Overhead flat lay of all ingredients needed for a recipe—the SpiceJax jar prominently placed among raw ingredients. Mise en place style: each ingredient in its own small bowl or measured out. Clean white marble surface. Even, bright lighting with soft shadows. Space at top for recipe title. The jar is clearly the star seasoning among supporting players. Mood: organized, achievable, save this recipe. Style: Pinterest recipe pin, food blog hero, cooking class prep." 
  },
  { 
    id: "recipe-steps", 
    label: "Step by Step", 
    category: "recipe",
    prompt: "A triptych or grid showing cooking progression—raw ingredients, mid-cook action with the SpiceJax jar being used, and final plated dish. Three distinct moments in one frame. Clean backgrounds, consistent lighting across all three. The jar appears in the middle panel as the key step. Numbers or arrows could be overlaid. Mood: easy to follow, you can do this, tutorial ready. Style: recipe blog process shots, cooking tutorial frames, step-by-step guide." 
  },
  { 
    id: "recipe-final", 
    label: "Recipe Hero", 
    category: "recipe",
    prompt: "The finished dish as the hero with the SpiceJax jar beside it—classic recipe blog composition. Vertical 4:5 ratio. The dish is beautifully plated, steam rising, garnished perfectly. The jar sits slightly behind, clearly the flavor source. Generous white space above for recipe title text. One or two raw ingredients scattered as props. Bright, airy lighting. Mood: I need to make this, save for later, dinner inspiration. Style: Half Baked Harvest aesthetic, Pinterest-optimized, food blog money shot." 
  },

  // ═══════════════════════════════════════════════════════════════
  // INFOGRAPHIC — Pinterest-optimized, save-worthy visual guides
  // These are designed for maximum saves and shares on social.
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "info-nutrition", 
    label: "Nutrition Breakdown", 
    category: "infographic",
    prompt: "Clean infographic-style composition: the SpiceJax jar centered with its key ingredients arranged in a radial pattern around it—each ingredient photographed beautifully with clear space for text labels. Small piles of individual spices (chili flakes, garlic granules, herbs) with their names. Clean white or soft cream background. Minimalist, editorial styling. Each element precisely placed with geometric intention. Space for 'WHAT'S INSIDE' header and nutritional callouts. Mood: transparent, educational, clean eating friendly. Style: Whole30/Paleo recipe blog, ingredient spotlight, wellness brand aesthetic." 
  },
  { 
    id: "info-5ways", 
    label: "5 Ways to Use", 
    category: "infographic",
    prompt: "Split into 5 distinct panels/sections showing 5 different dishes all made with the same SpiceJax jar. The jar sits prominently in the center or top. Each dish is small but appetizing—tacos, grilled chicken, roasted vegetables, eggs, pasta. Clean dividing lines between sections. Numbers 1-5 clearly visible. Consistent lighting across all panels. Space for dish names/captions. Mood: versatile, inspiring, save this for later. Style: Buzzfeed Tasty '5 ways' format, carousel-ready, Pinterest long pin." 
  },
  { 
    id: "info-quickrecipe", 
    label: "Quick Recipe Card", 
    category: "infographic",
    prompt: "Vertical Pinterest-optimized composition (2:3 ratio): finished dish photograph in the top 60%, the SpiceJax jar visible in the shot. Below: clean white space designed for recipe text overlay—ingredient list area on left, simple numbered steps on right. Bold header space for recipe title. Small icons suggesting prep time (clock), servings (plate), difficulty (chef hat). Mood: save this, make tonight, easy weeknight dinner. Style: Pinterest recipe pin, food blog standard, designed for text overlay." 
  },
  { 
    id: "info-comparison", 
    label: "Spice Swap Guide", 
    category: "infographic",
    prompt: "Educational comparison layout: the SpiceJax jar in the center with arrows pointing to dishes it can season. 'INSTEAD OF' on left showing generic store spices (blurred/generic), 'USE THIS' on right showing SpiceJax with the delicious result. Before/after energy but for ingredients. Clean, bright styling. The SpiceJax result looks dramatically better. Space for comparison callouts. Mood: upgrade your cooking, why settle, flavor hack. Style: product comparison infographic, educational food content." 
  },
  { 
    id: "info-flavor-wheel", 
    label: "Flavor Profile Wheel", 
    category: "infographic",
    prompt: "The SpiceJax jar at the center of a circular 'flavor wheel' arrangement—individual ingredients arranged in a perfect circle around it, creating a mandala-like pattern. Each ingredient represents a flavor note: heat (chilies), sweet (honey), savory (garlic), earthy (cumin), etc. Color-coded sections suggesting flavor categories. Overhead shot, perfectly symmetrical. Clean background. Space for flavor descriptors. Mood: complex flavors simplified, flavor education, artisan craft. Style: wine tasting wheel meets food photography, educational but beautiful." 
  },
  { 
    id: "info-pairing", 
    label: "Perfect Pairings", 
    category: "infographic",
    prompt: "Grid layout showing the SpiceJax jar paired with its ideal ingredients and dishes. The jar in the top-center, with 6-9 smaller images below showing: proteins it complements (chicken, beef, shrimp), vegetables it elevates (roasted cauliflower, grilled corn), cuisines it fits (Mexican, American BBQ, Asian fusion). Each pairing photographed consistently. Clean dividing lines. Space for pairing names. Mood: endless possibilities, flavor inspiration, meal planning helper. Style: food pairing guide, sommelier-style recommendations for spices." 
  },
  { 
    id: "info-weekmeal", 
    label: "Week of Meals", 
    category: "infographic",
    prompt: "7-panel grid showing Monday through Sunday meals—all made with the same SpiceJax jar. The jar featured prominently at the top or center. Each day shows a different dish: Taco Tuesday, Wing Wednesday, etc. Days of the week labeled clearly. Consistent photography style across all panels. The message: one jar, infinite possibilities. Mood: meal prep inspiration, weekly planning, versatile pantry staple. Style: meal prep influencer content, weekly menu planning, save for meal ideas." 
  },
  { 
    id: "info-howto", 
    label: "How-To Guide", 
    category: "infographic",
    prompt: "Step-by-step visual tutorial: 4-6 numbered panels showing the process of making a signature dish with SpiceJax. Panel 1: raw protein. Panel 2: seasoning generously with the jar (action shot, spice falling). Panel 3: cooking method (grill/pan/oven). Panel 4: finished dish, beauty shot. Clear numbers, consistent angles, progressive story. The jar appears in the seasoning step prominently. Mood: I can do this, clear instructions, cooking confidence. Style: visual recipe tutorial, step-by-step cooking guide." 
  },
  { 
    id: "info-tips", 
    label: "Pro Tips Card", 
    category: "infographic",
    prompt: "Clean editorial layout: the SpiceJax jar with 3-5 'pro tip' sections around it. Each tip area has space for an icon and text: 'Season generously', 'Let it rest', 'Don't skip the sear', etc. Small food photography details support each tip—a perfectly seared steak, resting meat, generous seasoning action. Professional chef energy but accessible. Mood: level up your cooking, insider knowledge, chef secrets. Style: cooking tips infographic, Bon Appétit educational content." 
  },
  { 
    id: "info-mistakes", 
    label: "Common Mistakes", 
    category: "infographic",
    prompt: "Split comparison: LEFT side shows cooking mistakes (underseasoned, overcrowded pan, wrong temp) with subtle red X marks. RIGHT side shows the correct way using SpiceJax with green checkmarks. The SpiceJax jar sits at the dividing line as the solution. Dramatic difference between sad results and perfect results. Educational but not preachy. Mood: learn from mistakes, cooking school, fix your food. Style: common mistakes guide, educational food content, problem/solution format." 
  },
  { 
    id: "info-seasonal", 
    label: "Seasonal Menu", 
    category: "infographic",
    prompt: "4-quadrant layout representing the seasons—Spring, Summer, Fall, Winter—each with a dish perfectly suited for that season, all made with SpiceJax. Spring: light grilled proteins with fresh herbs. Summer: BBQ and grilled corn. Fall: hearty stews and roasted vegetables. Winter: comfort food and braised meats. The jar at the center where all four seasons meet. Seasonal colors and props in each quadrant. Mood: year-round inspiration, seasonal cooking, always relevant. Style: seasonal recipe guide, year-round content calendar." 
  },
  { 
    id: "info-heatguide", 
    label: "Heat Level Guide", 
    category: "infographic",
    prompt: "Visual heat scale infographic: all SpiceJax products arranged from mildest to hottest (left to right or bottom to top). Flame icons increasing in intensity. Color gradient from yellow/orange to deep red. Each jar labeled with heat level (1-5 flames) and best use case. Maybe a thermometer or heat meter graphic element. Who it's for: 'Mild Lovers' to 'Heat Seekers'. Mood: find your heat level, something for everyone, spice education. Style: product comparison guide, heat scale infographic." 
  },
  { 
    id: "info-anatomy", 
    label: "Anatomy of Dish", 
    category: "infographic",
    prompt: "Deconstructed view of a signature dish—like a 'anatomy of the perfect taco' or 'anatomy of the ultimate burger'. Each component labeled with lines pointing to it: the protein, the SpiceJax seasoning (prominently featured), the toppings, the base. Clean white background, components slightly separated but arranged to show the final dish structure. Educational and appetizing. Mood: understand great food, building blocks, culinary education. Style: deconstructed food photography, 'anatomy of' infographic trend." 
  },
  { 
    id: "info-mealprep", 
    label: "Meal Prep Guide", 
    category: "infographic",
    prompt: "Meal prep container flat lay: 4-5 glass containers filled with prepped meals, all seasoned with SpiceJax. The jar sits among them, clearly the unifying element. Each container shows a different protein/veggie combo. Labels or icons showing: prep day, portions, storage time. Organized, colorful, achievable. A weekly prep session result. Mood: organized life, healthy eating made easy, Sunday prep goals. Style: meal prep influencer content, healthy lifestyle, batch cooking guide." 
  },
  { 
    id: "info-macros", 
    label: "Macro-Friendly", 
    category: "infographic",
    prompt: "Fitness/health-focused composition: the SpiceJax jar beside a perfectly portioned plate—grilled protein, roasted vegetables, complex carb. Clean, minimal styling. Space for macro callouts: calories, protein, carbs, fat per serving. Measuring tools (food scale, measuring cups) subtly visible. Clean white or light grey background. Fitness meets foodie energy. Mood: flavor without guilt, diet-friendly, macro-conscious cooking. Style: fitness meal prep, macro counting community, healthy recipe content." 
  },
  { 
    id: "info-recipe-circular", 
    label: "Circular Recipe Card", 
    category: "infographic",
    prompt: "CREATE A COMPLETE RECIPE INFOGRAPHIC. Pinterest vertical format (2:3). MUST INCLUDE ALL THESE ELEMENTS: TITLE: Large decorative recipe name at top (e.g., 'Honey Glazed Salmon' or 'Spiced Chicken Tacos'). CENTER: Beautiful hero photo of the finished plated dish with steam, on white plate. LEFT SIDE - COOKING STEPS in white circular badges flowing downward: Step 1 (Season protein icon), Step 2 (Sear/Cook icon), Step 3 (Make sauce icon), Step 4 (Glaze/Finish icon), Step 5 (Plate & Serve icon). Each step has small cooking icon and brief 2-3 word label. RIGHT SIDE - INGREDIENTS in white circles with measurements: Main protein (e.g., '4 fillets'), SpiceJax jar with GOLDEN RING highlight and '2 tbsp' label, honey/sauce '1/4 cup', citrus '2 tbsp', butter '2 tbsp', fresh herbs 'garnish'. BOTTOM BAR: Three rounded badges showing '280 kcal/serving', '20 min cook', '4 servings'. BACKGROUND: Warm cream/gold gradient with faint food sketches. Gold curved lines connecting elements. This must look like a COMPLETE, USABLE RECIPE CARD." 
  },
  { 
    id: "info-recipe-gold", 
    label: "Golden Recipe Infographic", 
    category: "infographic",
    prompt: "CREATE A LUXURIOUS COMPLETE RECIPE INFOGRAPHIC with gold theme. Vertical Pinterest format. REQUIRED ELEMENTS: TITLE: Elegant script font recipe name with gold flourishes (generate an appetizing recipe name). HERO CENTER: Large circular photo of stunning plated dish, restaurant-quality presentation. LEFT FLOW - 5 NUMBERED STEPS in gold-bordered circles: 1. Prep/Season, 2. Sear/Cook, 3. Build sauce, 4. Combine/Glaze, 5. Plate & garnish. Each with elegant icon. RIGHT COLUMN - INGREDIENT CIRCLES with gold borders, each showing: ingredient photo + measurement text. Include: main protein with weight, SpiceJax jar (PROMINENT with golden glow) + '2-3 tbsp', liquid ingredient + amount, aromatics + amount, butter/oil + amount, garnish herbs. BOTTOM: Elegant bar with 'calories per serving | prep + cook time | number of servings'. Background: Aged parchment with gold gradient. Style: Williams-Sonoma cookbook quality. GENERATE A REAL RECIPE." 
  },
  { 
    id: "info-recipe-modern", 
    label: "Modern Recipe Layout", 
    category: "infographic",
    prompt: "CREATE A MODERN MINIMALIST RECIPE INFOGRAPHIC. Vertical Pinterest format. MUST HAVE: TITLE: Bold clean sans-serif recipe name at top. CENTER: Beautifully styled hero dish photo with natural light. LEFT TIMELINE - Vertical numbered steps 1→2→3→4→5, each with minimalist line icon and action word (Season, Sear, Simmer, Glaze, Serve). RIGHT LIST - Ingredient circles in a column: each ingredient as small circular photo with measurement below (e.g., '6oz salmon', '2 tbsp SpiceJax [FEATURED]', '1/4 cup honey', '2 tbsp lime', '2 tbsp butter', 'parsley garnish'). BOTTOM STATS: Clean horizontal bar with kcal • minutes • servings numbers. Colors: White background, gray accents, one warm accent color. Drop shadows for depth. This should be a COMPLETE PRINTABLE RECIPE. Style: Half Baked Harvest, modern food blog." 
  },
  { 
    id: "info-recipe-rustic", 
    label: "Rustic Recipe Card", 
    category: "infographic",
    prompt: "CREATE A RUSTIC FARMHOUSE RECIPE INFOGRAPHIC. Vertical Pinterest format. INCLUDE ALL: TITLE: Hand-lettered style recipe name with ribbon banner. CENTER: Comfort food dish on rustic wood/ceramic, styled with herbs and napkin. LEFT STEPS - Vintage label-style badges numbered 1-5 flowing around dish: Prep, Season with SpiceJax, Cook low & slow, Rest, Serve family-style. RIGHT INGREDIENTS - Watercolor-style circles showing: meat/protein + weight, SpiceJax jar (WOODEN BACKGROUND highlight) + tablespoons, supporting ingredients with farmhouse measurements (cups, tablespoons). BOTTOM: Three kraft-paper style boxes with 'Feeds: 6', 'Time: 45 min', 'Comfort level: Maximum'. Background: Kraft paper texture, twine accents, herb sprigs. GENERATE ACTUAL RECIPE CONTENT. Style: Country Living, farmhouse cookbook." 
  },
  { 
    id: "info-recipe-dark", 
    label: "Dark & Moody Recipe", 
    category: "infographic",
    prompt: "CREATE A DRAMATIC DARK-THEMED RECIPE INFOGRAPHIC. Vertical Pinterest format. Dark charcoal background. REQUIRED: TITLE: Bold white/copper elegant recipe name at top. CENTER: Dramatically lit hero dish—deep shadows, gleaming highlights on sauce/glaze, visible steam. LEFT STEPS - Copper/gold circular badges on dark background, numbered 1-5: each step with icon (flame, pan, timer, brush, plate). Connected by thin gold lines. RIGHT INGREDIENTS - Dark circles with copper borders: each ingredient dramatically lit inside circle with copper text measurement. SpiceJax jar with WARM SPOTLIGHT and prominent placement. BOTTOM: Copper text stats bar—'350 kcal | 25 min | Serves 4'. GENERATE a sophisticated recipe name and complete ingredient list. Style: Fine dining menu, Bon Appétit Test Kitchen." 
  },
  { 
    id: "info-recipe-mexican", 
    label: "Mexican Recipe Style", 
    category: "infographic",
    prompt: "CREATE A VIBRANT MEXICAN RECIPE INFOGRAPHIC. Title: 'Birria Tacos with Birria Fiesta Blend' or similar Mexican dish name with Aztec-inspired decorative border. CENTER: Mouthwatering birria tacos/quesabirria with melted cheese, cilantro, onions, consomé bowl visible. LEFT STEPS - Terracotta circular badges with Mexican patterns, 6 steps: 1. Season & Sear beef, 2. Slow cook with broth, 3. Shred meat, 4. Dip tortilla in consomé, 5. Fill with beef & cheese, 6. Serve with consomé & toppings. RIGHT INGREDIENTS in colorful circles: '3 lbs beef chuck', 'SpiceJax BIRRIA FIESTA jar (GOLDEN SUNBURST) 4 tbsp', 'onion', 'canned tomatoes', 'beef broth 2 cups', 'corn tortillas 12-16', 'oaxaca cheese 2 cups', 'cilantro', 'lime wedges'. BOTTOM: '350 kcal | 30 min prep + 4hr cook | 6 servings'. Background: Aged paper with Talavera tile patterns. THIS IS A COMPLETE BIRRIA RECIPE." 
  },
  { 
    id: "info-recipe-asian", 
    label: "Asian Recipe Style", 
    category: "infographic",
    prompt: "CREATE A JAPANESE-INSPIRED RECIPE INFOGRAPHIC. Title: 'Spicy Miso Ramen with Shichimi' or 'Togarashi Rice Bowl' in clean typography with brush stroke accent. CENTER: Beautiful ramen bowl with soft egg (jammy yolk visible), chashu, nori, green onions, noodles lifted by chopsticks, steam rising. OR composed rice bowl. LEFT STEPS - Minimalist circles with Japanese aesthetic: 1. Prepare broth, 2. Cook noodles, 3. Prep toppings, 4. Assemble bowl, 5. Finish with Shichimi. RIGHT INGREDIENTS in clean white circles: 'ramen noodles 4 portions', 'pork broth 6 cups', 'SpiceJax SHICHIMI TOGARASHI (wave pattern accent) 2 tsp per bowl', 'soft boiled eggs 4', 'chashu pork 8 slices', 'nori sheets', 'green onions', 'sesame seeds'. BOTTOM: '420 kcal | 30 min | 4 bowls'. Background: Clean cream, subtle wave patterns. COMPLETE RAMEN/RICE BOWL RECIPE." 
  },
  { 
    id: "info-recipe-bbq", 
    label: "BBQ Recipe Style", 
    category: "infographic",
    prompt: "CREATE A BBQ PITMASTER RECIPE INFOGRAPHIC. Title: 'Competition-Style Ribs with Honey Chipotle Rub' in bold rustic typography with smoke/flame accents. CENTER: Dramatic rack of ribs—perfect bark, visible smoke ring, glistening glaze, on pink butcher paper. LEFT STEPS - Cast-iron style badges with flame icons: 1. Remove membrane & pat dry, 2. Apply SpiceJax rub generously, 3. Smoke at 250°F 3-4 hours, 4. Wrap in foil with butter, 5. Unwrap & glaze, 6. Rest 10 min & slice. RIGHT INGREDIENTS in weathered wood circles: 'baby back ribs 2 racks', 'SpiceJax HONEY CHIPOTLE (RED GLOW highlight) 1/4 cup', 'brown sugar 2 tbsp', 'apple cider vinegar 1/4 cup', 'butter 4 tbsp', 'honey for glaze'. BOTTOM: '380 kcal | 5+ hours low & slow | 6 servings'. Background: Dark wood grain, smoke wisps. COMPLETE RIB RECIPE." 
  },
  { 
    id: "info-recipe-breakfast", 
    label: "Breakfast Recipe Card", 
    category: "infographic",
    prompt: "CREATE A CHEERFUL BREAKFAST RECIPE INFOGRAPHIC. Title: 'Perfect Seasoned Scrambled Eggs' or 'Spiced Breakfast Tacos' in playful sunny typography. CENTER: Beautiful breakfast plate—fluffy golden eggs, crispy bacon, buttered toast OR loaded breakfast tacos with eggs, cheese, salsa. Morning light, steam rising. LEFT STEPS - Soft pastel circular badges: 1. Whisk eggs with cream, 2. Season with SpiceJax, 3. Cook low & slow stirring, 4. Remove while slightly wet, 5. Plate with sides. RIGHT INGREDIENTS in warm circles: 'large eggs 6', 'heavy cream 2 tbsp', 'SpiceJax seasoning (WARM GLOW) 1 tsp', 'butter 2 tbsp', 'fresh chives', 'crispy bacon 6 strips', 'toast or tortillas'. BOTTOM: '320 kcal | 15 min | 2 servings'. Background: Soft cream, subtle gingham. COMPLETE BREAKFAST RECIPE." 
  },
  { 
    id: "info-recipe-healthy", 
    label: "Healthy Recipe Card", 
    category: "infographic",
    prompt: "CREATE A HEALTHY CLEAN-EATING RECIPE INFOGRAPHIC. Title: 'Grilled Chicken Power Bowl' or 'Spiced Salmon with Roasted Vegetables' with fresh leaf accents. CENTER: Vibrant healthy dish—colorful grain bowl with lean protein, roasted vegetables, fresh greens, bright colors. Natural bright lighting. LEFT STEPS - Fresh green circular badges: 1. Season protein with SpiceJax, 2. Grill or bake protein, 3. Roast vegetables, 4. Prepare grain base, 5. Assemble bowl with greens. RIGHT INGREDIENTS in white circles with green borders: 'chicken breast 4 (6oz each)', 'SpiceJax seasoning (NATURAL highlight) 2 tbsp', 'quinoa 1 cup dry', 'mixed vegetables 4 cups', 'olive oil 2 tbsp', 'lemon juice', 'fresh herbs'. BOTTOM with health stats: '340 kcal | 35g protein | 30 min | 4 servings'. Background: Clean white, green gradient. COMPLETE HEALTHY RECIPE." 
  },

  // ═══════════════════════════════════════════════════════════════
  // DESIGN — Agency-quality, Canva/Adobe-style professional graphics
  // These look like they came from a design studio, not a camera.
  // ═══════════════════════════════════════════════════════════════
  { 
    id: "design-hero-banner", 
    label: "Hero Banner", 
    category: "design",
    prompt: "Professional advertising banner design: the SpiceJax jar as a 3D render-quality hero product shot floating against a bold gradient background—deep crimson fading to warm gold. Dramatic studio lighting with sharp reflections on the glass jar. Geometric accent shapes (circles, lines, abstract spice particles) as graphic elements. Clean negative space on left side for headline text. Bold, confident composition. Subtle grain texture for print-quality feel. Mood: premium brand, ad campaign ready, Super Bowl commercial energy. Style: Nike/Apple product advertising, creative agency hero banner, Behance featured work." 
  },
  { 
    id: "design-social-template", 
    label: "Social Template", 
    category: "design",
    prompt: "Instagram post template design: the SpiceJax jar photographed beautifully, integrated into a clean graphic layout with bold geometric frames—thick borders, rounded corners, or asymmetric crop boxes. Color blocks in brand colors (deep red, warm gold, black) creating visual hierarchy. Designated text areas with placeholder shapes for headline and body copy. Modern sans-serif typography energy. The product photo is one element in a designed composition. Mood: scroll-stopping, brand-consistent, template-ready. Style: Canva Pro template, social media design kit, brand guidelines compliant." 
  },
  { 
    id: "design-magazine-ad", 
    label: "Magazine Ad", 
    category: "design",
    prompt: "Full-page magazine advertisement layout: the SpiceJax jar shot with dramatic studio lighting on the right two-thirds of the frame, product reflection on glossy black surface. Left side is clean brand color (deep red or black) with space for white headline typography. Small logo lockup area in corner. Tagline space below product. Premium paper texture overlay subtle throughout. Cinematic color grading—rich blacks, warm highlights. Mood: Condé Nast advertising, premium print ad, tear-sheet worthy. Style: Vogue/GQ full-page ad, luxury brand advertising, print-first design." 
  },
  { 
    id: "design-packaging-mock", 
    label: "Packaging Mockup", 
    category: "design",
    prompt: "Professional packaging mockup scene: the SpiceJax jar displayed as if in a product photography studio—clean white or grey sweep background, perfect even lighting from softboxes. The jar is positioned at the classic 3/4 angle showing label and dimension. Subtle shadow grounds the product. Background has faint grid lines suggesting design software artboard. Ultra-clean, no props, pure product focus. Looks like a packaging designer's presentation render. Mood: client presentation ready, packaging portfolio, design review. Style: Behance packaging project, design agency mockup, Adobe Dimension render quality." 
  },
  { 
    id: "design-brand-spread", 
    label: "Brand Guidelines", 
    category: "design",
    prompt: "Brand identity spread layout: the SpiceJax jar centered with brand elements arranged around it—color swatches showing exact hex codes, typography samples, logo variations, pattern tiles, icon set. Clean grid layout with ample white space. Design system energy—everything has purpose and alignment. Subtle guides and measurements visible. Professional presentation of brand assets. Mood: design system documentation, brand book page, style guide. Style: Pentagram identity project, brand guidelines PDF, corporate design manual." 
  },
  { 
    id: "design-billboard", 
    label: "Billboard Ready", 
    category: "design",
    prompt: "Outdoor billboard advertising design: the SpiceJax jar HUGE and dramatic against a simple, high-contrast background. Minimal elements—just the product, maybe one food item showing usage, and space for a punchy 3-5 word headline. Colors optimized for distance viewing: bold reds, clean whites, high contrast. The jar is hero-sized, dominating the frame. No small details—everything reads at highway speed. Mood: Times Square energy, highway visibility, impossible to ignore. Style: outdoor advertising, OOH campaign, Lamar billboard design." 
  },
  { 
    id: "design-web-hero", 
    label: "Website Hero", 
    category: "design",
    prompt: "E-commerce website hero section design: the SpiceJax jar floating or placed dynamically on the right side, with the left side reserved for headline, subhead, and CTA button placement areas. Gradient background that would work with white text. Subtle particle effects or spice dust floating in the air. Modern, clean web aesthetic—lots of breathing room. The product is integrated into a web-native layout. Mood: Shopify store hero, direct-to-consumer brand, add-to-cart energy. Style: Webflow award site, e-commerce best practices, conversion-optimized layout." 
  },
  { 
    id: "design-carousel-set", 
    label: "Carousel Series", 
    category: "design",
    prompt: "Instagram carousel design system: the SpiceJax jar as the consistent element across what looks like a 5-slide carousel—each 'slide' showing a different angle or context but maintaining consistent graphic framing, color palette, and typography zones. Numbered indicators (1/5, 2/5, etc.) styled into the design. Swipe-right energy. Each frame works alone but better together. Cohesive visual system. Mood: swipe-worthy content, brand consistency, carousel goals. Style: Instagram carousel template, social content kit, series design." 
  },
  { 
    id: "design-story-template", 
    label: "Stories Template", 
    category: "design",
    prompt: "Instagram/TikTok Stories template design (9:16 vertical): the SpiceJax jar photographed and placed within a graphic frame—bold colored borders, sticker-style accents, hand-drawn arrow doodles pointing to the product. Space at top for headline, space at bottom for 'swipe up' or 'link in bio' CTA. Playful but polished. The photo is an element in the design, not the whole thing. Mood: tap-through worthy, Stories native, template ready. Style: Instagram Stories design kit, influencer template pack." 
  },
  { 
    id: "design-email-header", 
    label: "Email Header", 
    category: "design",
    prompt: "Email marketing header design: the SpiceJax jar featured in a horizontal banner format (600px wide energy). Clean graphic layout with the product on one side, space for headline and 'Shop Now' button on the other. Brand colors as background or accent blocks. Optimized for email clients—nothing too complex, but elevated and designed. Works above the fold. Mood: click-through worthy, inbox standout, email marketing best practices. Style: Klaviyo email template, DTC brand email, e-commerce newsletter header." 
  },
  { 
    id: "design-sale-graphic", 
    label: "Sale Announcement", 
    category: "design",
    prompt: "Promotional sale graphic: the SpiceJax jar with bold graphic elements screaming SALE energy—starburst shapes, percentage off badges, urgency markers. Colors are loud: red, yellow, black, white. The product is clear but surrounded by 'deal' visual language. Space for '25% OFF' or 'LIMITED TIME' text overlays. High energy, retail promotion vibes. Mood: Black Friday energy, flash sale, act now. Style: retail sale graphic, promotional design, limited time offer." 
  },
  { 
    id: "design-quote-card", 
    label: "Testimonial Card", 
    category: "design",
    prompt: "Customer testimonial design: the SpiceJax jar small in corner or as background element, with large quotation marks framing a testimonial text area. Clean, editorial layout. Space for 5-star rating graphic, customer name, and 'Verified Purchase' badge. Soft, trustworthy colors—creams, warm greys, accent red. The jar is present but the words are the hero. Mood: social proof, trust building, review spotlight. Style: testimonial card design, review graphic, social proof template." 
  },
  { 
    id: "design-comparison", 
    label: "Product Comparison", 
    category: "design",
    prompt: "Side-by-side product comparison graphic: SpiceJax jar on the right (the winner) vs. a generic 'other brand' representation on the left (greyed out, less appealing). Checkmarks and X marks for feature comparison. Clean two-column layout. SpiceJax side is vibrant, colorful, premium. Other side is dull, generic. Clear visual hierarchy favoring SpiceJax. Mood: why we're better, comparison shopping, competitive advantage. Style: product comparison infographic, competitive analysis visual, marketing comparison chart." 
  },
  { 
    id: "design-feature-grid", 
    label: "Feature Highlights", 
    category: "design",
    prompt: "Product feature grid design: the SpiceJax jar centered with 4-6 feature callouts arranged around it—icons with short text labels: 'All Natural', 'Small Batch', 'Bold Flavor', 'No MSG', etc. Clean connecting lines or subtle visual links between features and the jar. Organized grid energy. Each feature has a custom icon in brand style. Mood: why choose us, product benefits, feature showcase. Style: product feature graphic, benefit highlights, e-commerce detail design." 
  },
  { 
    id: "design-launch", 
    label: "Product Launch", 
    category: "design",
    prompt: "New product launch announcement design: the SpiceJax jar revealed dramatically—emerging from stylized smoke or light rays, or shown with a 'NEW' badge/ribbon. Gradient background building excitement. 'Introducing' or 'Now Available' text zone. Premium reveal energy—like unveiling something special. Dramatic lighting on the product. Particle effects suggesting newness and excitement. Mood: launch day energy, new release, announcement worthy. Style: Apple product launch aesthetic, reveal graphic, new product announcement." 
  },
  { 
    id: "design-collage", 
    label: "Brand Collage", 
    category: "design",
    prompt: "Creative brand collage: the SpiceJax jar integrated into an artistic arrangement—mixed with cut-out food photography, hand-drawn illustrations, texture swatches, typography snippets, color blocks. Layered, dimensional, editorial. Different elements at different scales creating visual interest. Vintage magazine collage meets modern design. The jar is one beautiful element among many. Mood: creative expression, brand personality, editorial art. Style: mood board aesthetic, collage art, creative direction presentation." 
  },
  { 
    id: "design-minimal", 
    label: "Swiss Minimal", 
    category: "design",
    prompt: "Ultra-minimal Swiss design aesthetic: the SpiceJax jar photographed cleanly, placed on a strict grid layout. Bold Helvetica-style typography zones. Extreme negative space—80% empty, 20% content. Black, white, and one brand color only. Mathematical precision in placement. No decoration, only essential elements. The grid is visible, intentional. Mood: design purity, less is more, museum quality. Style: Swiss International Style, Massimo Vignelli inspired, modernist graphic design." 
  },
  { 
    id: "design-retro", 
    label: "Retro Diner", 
    category: "design",
    prompt: "Vintage Americana design aesthetic: the SpiceJax jar styled in a retro 1950s diner advertisement look—halftone dot textures, vintage color palette (cream, red, turquoise), hand-lettering style typography zones, starburst accents, ribbon banners. The jar photographed but treated with retro filters. Nostalgic but fresh. Feels like a vintage poster brought to life. Mood: Americana nostalgia, vintage charm, throwback vibes. Style: mid-century advertisement, diner poster, retro brand revival." 
  },
  { 
    id: "design-neon", 
    label: "Neon Glow", 
    category: "design",
    prompt: "Bold neon aesthetic: the SpiceJax jar photographed against pure black, dramatically lit with colored gels creating neon pink, electric blue, and hot orange rim lighting. Actual neon sign elements or glow effects framing the product. Cyberpunk meets food. High contrast, saturated colors bleeding and glowing. The jar gleams with synthetic light. Mood: night market energy, bold and loud, unforgettable. Style: neon photography, synthwave aesthetic, cyberpunk food." 
  },
  { 
    id: "design-3d-render", 
    label: "3D Product Render", 
    category: "design",
    prompt: "Hyper-realistic 3D render aesthetic: the SpiceJax jar looking like a perfect CGI render—impossibly smooth lighting, perfect reflections, floating in abstract 3D space with geometric shapes (spheres, cubes, toruses) in brand colors orbiting around it. Soft studio HDRI lighting. Subtle depth of field. The jar appears to levitate in a digital void. Clean, technical perfection only achievable in 3D software. Mood: digital art, CGI perfection, future-forward. Style: Blender/Cinema 4D product render, 3D advertising, digital product visualization." 
  },
  { 
    id: "design-gradient-mesh", 
    label: "Gradient Flow", 
    category: "design",
    prompt: "Flowing gradient mesh design: the SpiceJax jar floating against a beautiful, organic gradient mesh background—smooth color transitions between deep reds, warm oranges, soft golds, and rich browns. The gradients flow like liquid silk. The jar is sharp and grounded while the background is dreamy and fluid. Modern, premium, hypnotic. Mood: design-forward, mesmerizing, high-end tech brand energy. Style: iOS wallpaper aesthetic, Stripe/Linear brand design, gradient mesh art." 
  },
  { 
    id: "design-cutout", 
    label: "Paper Cutout", 
    category: "design",
    prompt: "Paper craft aesthetic: the SpiceJax jar photographed and stylized to look like a paper cutout collage—layered paper textures, subtle shadows between 'paper' layers, hand-cut edge effects. Surrounding elements (ingredients, flames, text shapes) also appear as paper cutouts at different depths. Tactile, handmade feel despite digital execution. Warm, craft energy. Mood: handmade premium, craft aesthetic, tactile design. Style: paper craft illustration, cut paper art, layered paper design." 
  },
  { 
    id: "design-duotone", 
    label: "Bold Duotone", 
    category: "design",
    prompt: "Striking duotone design: the SpiceJax jar photographed and converted to dramatic two-color treatment—deep red and bright gold, or black and vibrant orange. High contrast, graphic, poster-worthy. The jar becomes almost iconic, reduced to essential forms and bold color. Modern, punchy, impossible to ignore. Clean typography zones in contrasting colors. Mood: bold statement, graphic impact, poster art. Style: Spotify Wrapped aesthetic, duotone graphic design, two-color printing." 
  },
  { 
    id: "design-isometric", 
    label: "Isometric Scene", 
    category: "design",
    prompt: "Isometric illustration style: the SpiceJax jar rendered as if in an isometric 3D scene—at a perfect 30-degree angle, surrounded by isometric kitchen elements (tiny stove, cutting board, utensils) all at the same angle. Flat colors, clean edges, no realistic shadows—illustrative style. A miniature world built around the product. Playful but precise. Mood: playful sophistication, illustration meets product, isometric world. Style: isometric illustration, game art aesthetic, flat design 3D." 
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
  { id: "linkedin-landscape", label: "LinkedIn Landscape", platform: "linkedin", ratio: "1.91:1", pixels: "1200×628", desc: "Feed posts, articles" },
  { id: "linkedin-square", label: "LinkedIn Square", platform: "linkedin", ratio: "1:1", pixels: "1080×1080", desc: "Feed posts (higher engagement)" },
  { id: "linkedin-portrait", label: "LinkedIn Portrait", platform: "linkedin", ratio: "4:5", pixels: "1080×1350", desc: "Mobile-optimized posts" },
  
  // YouTube
  { id: "youtube-thumb", label: "YouTube Thumbnail", platform: "youtube", ratio: "16:9", pixels: "1280×720", desc: "Video thumbnails" },
  
  // E-commerce / WooCommerce
  { id: "woo-main", label: "WooCommerce Main", platform: "ecommerce", ratio: "1:1", pixels: "1000×1000", desc: "Product page hero image" },
  { id: "woo-gallery", label: "WooCommerce Gallery", platform: "ecommerce", ratio: "1:1", pixels: "800×800", desc: "Product gallery images" },
  { id: "woo-thumbnail", label: "WooCommerce Thumb", platform: "ecommerce", ratio: "1:1", pixels: "300×300", desc: "Cart & catalog thumbnails" },
  { id: "woo-zoom", label: "WooCommerce Zoom", platform: "ecommerce", ratio: "1:1", pixels: "1200×1200", desc: "Hover zoom (high-res)" },
  { id: "amazon", label: "Amazon", platform: "ecommerce", ratio: "1:1", pixels: "2000×2000", desc: "Amazon main image (white bg)" },
  { id: "etsy", label: "Etsy", platform: "ecommerce", ratio: "4:3", pixels: "2000×1500", desc: "Etsy listing images" },
  
  // Print/General
  { id: "print-4x6", label: "Print 4×6", platform: "print", ratio: "3:2", pixels: "1800×1200", desc: "Standard photo print" },
  { id: "print-5x7", label: "Print 5×7", platform: "print", ratio: "7:5", pixels: "2100×1500", desc: "Portrait print" },
  { id: "print-8x10", label: "Print 8×10", platform: "print", ratio: "5:4", pixels: "2400×1920", desc: "Portrait/frame print" },
  { id: "print-11x14", label: "Print 11×14", platform: "print", ratio: "7:5.5", pixels: "3300×2520", desc: "Large frame print" },
];

export default function ImageEnhancerPage() {
  const router = useRouter();
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
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState<"single" | "multiple" | "all">("single");
  const [isFreeformMode, setIsFreeformMode] = useState(false);
  const [freeformPrompt, setFreeformPrompt] = useState<string>("");
  
  // Load products from localStorage
  const [products, setProducts] = useState<SpiceProduct[]>([]);
  
  useEffect(() => {
    const loadedProducts = getProducts();
    setProducts(loadedProducts);
    // Set default product to first one if not set
    if (loadedProducts.length > 0 && selectedProductIds.length === 0) {
      setSelectedProductIds([loadedProducts[0].id]);
    }
  }, []);

  // Handle product selection based on mode
  const toggleProduct = (productId: string) => {
    if (selectionMode === "single") {
      setSelectedProductIds([productId]);
    } else if (selectionMode === "multiple") {
      setSelectedProductIds(prev => 
        prev.includes(productId) 
          ? prev.filter(id => id !== productId)
          : [...prev, productId]
      );
    }
  };

  // Handle mode change
  const handleModeChange = (mode: "single" | "multiple" | "all") => {
    setSelectionMode(mode);
    if (mode === "all") {
      setSelectedProductIds(products.map(p => p.id));
    } else if (mode === "single" && selectedProductIds.length > 1) {
      setSelectedProductIds([selectedProductIds[0]]);
    }
  };

  // Get selected products
  const selectedProducts = useMemo(() => {
    return products.filter(p => selectedProductIds.includes(p.id));
  }, [selectedProductIds, products]);

  // For backward compatibility - single active product (first selected)
  const activeProduct = useMemo(() => {
    if (products.length === 0) return null;
    return products.find((p) => p.id === selectedProductIds[0]) || products[0];
  }, [selectedProductIds, products]);

  const activeFormat = useMemo(() => {
    return FORMAT_PRESETS.find((f) => f.id === formatId) || FORMAT_PRESETS[0];
  }, [formatId]);

  const activeScenePrompt = useMemo(() => {
    // FREEFORM MODE: Just use the raw prompt, no product context
    if (isFreeformMode) {
      const formatInstruction = `Output image dimensions: ${activeFormat.ratio} aspect ratio (${activeFormat.pixels}).`;
      return freeformPrompt.trim() ? `${freeformPrompt.trim()}\n\n${formatInstruction}` : "";
    }
    
    const basePrompt = sceneId === "custom" 
      ? customScene.trim()
      : SCENE_PRESETS.find((scene) => scene.id === sceneId)?.prompt ?? "";
    
    // Build product context for the AI
    let productContext = "";
    
    if (selectedProducts.length === 0) {
      productContext = "";
    } else if (selectedProducts.length === 1) {
      // Single product
      const product = selectedProducts[0];
      const ingredients = product.ingredients || [];
      const goodOn = product.goodOn || [];
      productContext = `
PRODUCT INFORMATION:
- Product Name: SpiceJax ${product.name}
- Key Ingredients: ${ingredients.slice(0, 5).join(", ")}
- Best Used On: ${goodOn.join(", ")}
- Flavor Profile: ${product.description || ""}
- Heat Level: ${product.heat || 0}/5

IMPORTANT: Incorporate these actual ingredients as props in the scene where appropriate. For example, if the blend contains "Guajillo Chili", show dried guajillo chilies. If it contains "Honey", show a honey dipper or honeycomb. If it contains "Garlic", show fresh garlic cloves. Make the ingredients visually prominent and appetizing.`;
    } else {
      // Multiple products - group shot
      const productList = selectedProducts.map((product, i) => {
        const ingredients = product.ingredients || [];
        return `${i + 1}. SpiceJax ${product.name} (${ingredients.slice(0, 3).join(", ")})`;
      }).join("\n");
      
      // Collect all unique ingredients across selected products
      const allIngredients = [...new Set(selectedProducts.flatMap(p => p.ingredients || []))];
      
      productContext = `
MULTIPLE PRODUCTS - GROUP SHOT (${selectedProducts.length} jars):
${productList}

COMPOSITION GUIDANCE:
- Arrange all ${selectedProducts.length} SpiceJax jars artfully in the scene
- Create visual hierarchy - vary heights using props (books, cutting boards, small boxes)
- Ensure all labels are visible and readable
- The jars should feel like a cohesive collection/family

SHARED INGREDIENTS TO FEATURE AS PROPS:
${allIngredients.slice(0, 8).join(", ")}

IMPORTANT: This is a product lineup/collection shot. Make sure each jar is clearly visible and the arrangement feels intentional and premium.`;
    }

    // Append format instructions to the prompt
    const formatInstruction = `Output image dimensions: ${activeFormat.ratio} aspect ratio (${activeFormat.pixels}). Compose the scene to work perfectly in this format with appropriate headroom and subject placement.`;
    
    return `${basePrompt}\n\n${productContext}\n\n${formatInstruction}`;
  }, [sceneId, customScene, activeFormat, selectedProducts, isFreeformMode, freeformPrompt]);

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const normalizeImageDataUrl = async (file: File) => {
    const dataUrl = await readFileAsDataUrl(file);
    const isStandardType = file.type === "image/jpeg" || file.type === "image/png";
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isStandardType && !isIOS) return dataUrl;

    const image = document.createElement('img');
    image.src = dataUrl;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Image decode failed"));
    });

    const width = image.naturalWidth || image.width;
    const height = image.naturalHeight || image.height;
    const maxDim = 2048;
    const scale = Math.min(1, maxDim / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await normalizeImageDataUrl(file);
      setUploadedImage(dataUrl);
      setEnhancedImage(null);
      setError(null);
      setApproved(false);
    } catch (err) {
      console.error("Image upload error:", err);
      setError("Unable to read this image. Try a different file.");
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
    
    // Get scene, format, and product labels for the filename
    const sceneLabel = SCENE_PRESETS.find((s) => s.id === sceneId)?.label || "Custom";
    const formatLabel = activeFormat.label;
    
    // Handle single vs multiple products in filename
    let productLabel: string;
    if (selectedProducts.length === 0) {
      productLabel = "Product";
    } else if (selectedProducts.length === 1) {
      productLabel = selectedProducts[0].shortName;
    } else if (selectedProducts.length === products.length) {
      productLabel = "AllProducts";
    } else {
      productLabel = `${selectedProducts.length}Products`;
    }
    
    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    
    // Create a descriptive filename: SpiceJax_BirriaFiesta_DarkDramatic_InstagramSquare_2024-01-15
    const fileName = `SpiceJax_${productLabel.replace(/[^a-zA-Z0-9]/g, "")}_${sceneLabel.replace(/[^a-zA-Z0-9]/g, "")}_${formatLabel.replace(/[^a-zA-Z0-9]/g, "")}_${timestamp}`;
    
    try {
      const settings = getSettings();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (settings.n8nUrl) headers["X-N8N-URL"] = settings.n8nUrl;
      if (settings.apiKey) headers["X-N8N-API-KEY"] = settings.apiKey;

      await fetch("/api/library/upload", {
        method: "POST",
        headers,
        body: JSON.stringify({
          enhancedImage,
          sceneId,
          sceneLabel,
          formatId,
          formatLabel,
          formatRatio: activeFormat.ratio,
          formatPixels: activeFormat.pixels,
          fileName,
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

  // Navigate to Content Studio with the enhanced image
  const handleGenerateCaption = () => {
    if (!enhancedImage) return;
    
    const productName = selectedProducts.length === 1 
      ? selectedProducts[0].shortName 
      : selectedProducts.length > 1 
        ? `${selectedProducts.length}Products` 
        : "";
    
    const params = new URLSearchParams({
      image: enhancedImage,
      product: productName,
      platform: activeFormat.platform,
      format: activeFormat.label,
      from: "enhance",
    });
    
    router.push(`/content?${params.toString()}`);
  };

  return (
    <>
      <MainLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
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
                {isFreeformMode 
                  ? "Upload any image and write your own prompt" 
                  : "Transform product shots with AI-powered scene generation"}
              </p>
            </div>
            
            {/* Mode Toggle */}
            <div className="flex items-center gap-2 bg-brand-sage rounded-2xl p-1.5 border border-brand-gold/20">
              <button
                onClick={() => setIsFreeformMode(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  !isFreeformMode
                    ? "bg-[#243530] text-white shadow-lg"
                    : "text-brand-text/60 hover:text-brand-title"
                }`}
              >
                🌶️ SpiceJax Mode
              </button>
              <button
                onClick={() => setIsFreeformMode(true)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  isFreeformMode
                    ? "bg-gradient-to-r from-brand-gold to-brand-rust text-white shadow-lg shadow-brand-gold/30"
                    : "text-brand-text/60 hover:text-brand-title"
                }`}
              >
                ✨ Freeform
              </button>
            </div>
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

              {/* Freeform Mode - Custom Prompt */}
              {isFreeformMode && (
                <div className="bg-gradient-to-br from-gold-50 to-rust-50 rounded-3xl border border-brand-gold/40 shadow-[0_2px_20px_-4px_rgba(212,168,75,0.15)] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-gold to-brand-rust flex items-center justify-center shadow-lg shadow-brand-gold/30">
                      <span className="text-xl">✨</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-brand-title">Freeform Mode</h2>
                      <p className="text-xs text-brand-text/60">Write any prompt - no limits!</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-brand-title">Describe what you want to create:</p>
                    <textarea
                      value={freeformPrompt}
                      onChange={(e) => setFreeformPrompt(e.target.value)}
                      placeholder="Example prompts:&#10;• A cozy coffee shop scene with a latte art heart, warm morning light&#10;• Minimalist flat lay of cooking ingredients on marble&#10;• Neon-lit street food stall in Tokyo at night&#10;• Recipe infographic with circular ingredient icons&#10;• Professional product photography of [your item] on white background"
                      className="w-full rounded-2xl border border-brand-gold/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 text-sm p-4 transition-all min-h-[200px] placeholder:text-brand-text/40"
                      rows={8}
                    />
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-brand-text/50">Quick ideas:</span>
                      {[
                        "Recipe infographic",
                        "Product on white",
                        "Moody food photo",
                        "Flat lay",
                        "Action shot",
                        "Minimalist design",
                      ].map((idea) => (
                        <button
                          key={idea}
                          onClick={() => setFreeformPrompt(idea + " - ")}
                          className="px-2 py-1 text-xs bg-white rounded-lg border border-brand-gold/30 text-brand-rust hover:bg-gold-50 hover:border-brand-gold transition-colors"
                        >
                          {idea}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Product Selection - Only in SpiceJax Mode */}
              {!isFreeformMode && (
              <div className="bg-white rounded-3xl border border-brand-gold/20 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6">
                <p className="text-sm font-bold text-brand-title mb-3">Which SpiceJax product(s)?</p>
                
                {/* Selection Mode Tabs */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => handleModeChange("single")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                      selectionMode === "single"
                        ? "bg-[#243530] text-white"
                        : "bg-brand-sage text-brand-text hover:bg-spice-100"
                    }`}
                  >
                    Single
                  </button>
                  <button
                    onClick={() => handleModeChange("multiple")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                      selectionMode === "multiple"
                        ? "bg-[#243530] text-white"
                        : "bg-brand-sage text-brand-text hover:bg-spice-100"
                    }`}
                  >
                    Pick Multiple
                  </button>
                  <button
                    onClick={() => handleModeChange("all")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                      selectionMode === "all"
                        ? "bg-[#243530] text-white"
                        : "bg-brand-sage text-brand-text hover:bg-spice-100"
                    }`}
                  >
                    All ({products.length})
                  </button>
                </div>

                {selectionMode !== "all" && (
                  <div className="space-y-2">
                    {products.map((product) => {
                      const isSelected = selectedProductIds.includes(product.id);
                      return (
                        <button
                          key={product.id}
                          onClick={() => toggleProduct(product.id)}
                          className={`w-full p-4 rounded-2xl text-left transition-all ${
                            isSelected
                              ? "bg-[#243530] text-white shadow-lg"
                              : "bg-brand-sage text-brand-text hover:bg-spice-100 border border-transparent hover:border-brand-gold/20"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {selectionMode === "multiple" && (
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                  isSelected ? "bg-white border-white" : "border-brand-text/30"
                                }`}>
                                  {isSelected && <Check className="w-3 h-3 text-[#243530]" />}
                                </div>
                              )}
                              <span className="font-bold">{product.shortName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Flame
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < product.heat
                                      ? isSelected ? "text-orange-400" : "text-brand-rust"
                                      : isSelected ? "text-white/20" : "text-brand-text/20"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className={`text-xs ${isSelected ? "text-white/70" : "text-brand-text/50"}`}>
                            {(product.ingredients || []).slice(0, 4).join(", ")}...
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Selected Products Summary */}
                {selectedProducts.length > 0 && (
                  <div className="mt-4 p-4 bg-brand-sage rounded-xl border border-brand-gold/10">
                    {selectedProducts.length === 1 ? (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: selectedProducts[0].color }}
                          />
                          <p className="text-xs font-bold text-brand-title">{selectedProducts[0].name}</p>
                        </div>
                        <p className="text-[11px] text-brand-text/60 mb-2">{selectedProducts[0].description}</p>
                        <div className="flex flex-wrap gap-1">
                          {(selectedProducts[0].ingredients || []).map((ing) => (
                            <span 
                              key={ing} 
                              className="px-2 py-0.5 bg-white rounded-full text-[10px] font-medium text-brand-text/70 border border-brand-gold/20"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex -space-x-1">
                            {selectedProducts.slice(0, 5).map((p) => (
                              <div 
                                key={p.id}
                                className="w-4 h-4 rounded-full border-2 border-white" 
                                style={{ backgroundColor: p.color }}
                              />
                            ))}
                          </div>
                          <p className="text-xs font-bold text-brand-title">
                            {selectedProducts.length} Products Selected
                          </p>
                        </div>
                        <p className="text-[11px] text-brand-text/60 mb-2">
                          Group shot with: {selectedProducts.map(p => p.shortName).join(", ")}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {[...new Set(selectedProducts.flatMap(p => p.ingredients || []))].slice(0, 8).map((ing) => (
                            <span 
                              key={ing} 
                              className="px-2 py-0.5 bg-white rounded-full text-[10px] font-medium text-brand-text/70 border border-brand-gold/20"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              )}

              {/* Scene Selection - Only in SpiceJax Mode */}
              {!isFreeformMode && (
              <div className="bg-white rounded-3xl border border-brand-gold/20 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6">
                <p className="text-sm font-bold text-brand-title mb-4">Choose a scene vibe</p>
                
                {/* Category Tabs */}
                <div className="flex gap-1 overflow-x-auto no-scrollbar pb-3 mb-4 border-b border-brand-gold/10">
                  {[
                    { id: "hero", label: "Hero", desc: "Clean product shots" },
                    { id: "ecommerce", label: "E-comm 🛒", desc: "Amazon/WooCommerce" },
                    { id: "signature", label: "Signature 🌶️", desc: "Product-specific" },
                    { id: "lifestyle", label: "Lifestyle", desc: "Aspirational" },
                    { id: "cuisine", label: "Cuisine", desc: "Use cases" },
                    { id: "process", label: "Process", desc: "Trust builders" },
                    { id: "seasonal", label: "Seasonal", desc: "Campaigns" },
                    { id: "social", label: "Social", desc: "Platform-ready" },
                    { id: "bundle", label: "Bundle 📦", desc: "Multi-product" },
                    { id: "video", label: "Video 🎬", desc: "Thumbnails" },
                    { id: "ugc", label: "UGC 📱", desc: "Authentic" },
                    { id: "recipe", label: "Recipe 📝", desc: "Blog/Pinterest" },
                    { id: "infographic", label: "Infographic 📊", desc: "Save-worthy guides" },
                    { id: "design", label: "Design Studio 🎨", desc: "Agency-quality" },
                    { id: "premium", label: "Premium ✨", desc: "Showstoppers" },
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
              )}

              {/* Format Selection */}
              <div className="bg-white rounded-3xl border border-brand-gold/20 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6">
                <p className="text-sm font-bold text-brand-title mb-4">Output format</p>
                
                {/* Platform Tabs */}
                <div className="flex gap-1 overflow-x-auto no-scrollbar pb-3 mb-4 border-b border-brand-gold/10">
                  {[
                    { id: "instagram", label: "Instagram", color: "#E4405F", icon: (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )},
                    { id: "facebook", label: "Facebook", color: "#1877F2", icon: (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    )},
                    { id: "tiktok", label: "TikTok", color: "#000000", icon: (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    )},
                    { id: "pinterest", label: "Pinterest", color: "#BD081C", icon: (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                      </svg>
                    )},
                    { id: "twitter", label: "X", color: "#000000", icon: (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    )},
                    { id: "linkedin", label: "LinkedIn", color: "#0A66C2", icon: (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    )},
                    { id: "youtube", label: "YouTube", color: "#FF0000", icon: (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    )},
                    { id: "ecommerce", label: "E-comm", color: "#243530", icon: (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                    )},
                    { id: "print", label: "Print", color: "#243530", icon: (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                      </svg>
                    )},
                  ].map((plat) => (
                    <button
                      key={plat.id}
                      onClick={() => {
                        const firstFormat = FORMAT_PRESETS.find((f) => f.platform === plat.id);
                        if (firstFormat) setFormatId(firstFormat.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        activeFormat.platform === plat.id
                          ? "bg-[#243530] text-white"
                          : "text-brand-text/60 hover:text-brand-title hover:bg-brand-sage"
                      }`}
                    >
                      <span style={{ color: activeFormat.platform === plat.id ? "white" : plat.color }}>{plat.icon}</span>
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
                disabled={!uploadedImage || enhancing || (isFreeformMode && !freeformPrompt.trim())}
                className={`w-full py-4 text-white font-bold text-lg rounded-2xl disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 disabled:shadow-none ${
                  isFreeformMode 
                    ? "bg-gradient-to-r from-brand-gold to-brand-rust hover:from-brand-rust hover:to-brand-gold shadow-xl shadow-brand-gold/30" 
                    : "bg-gradient-to-r from-brand-title to-brand-black hover:from-brand-black hover:to-brand-title shadow-xl shadow-brand-title/20"
                }`}
              >
                {enhancing ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    {isFreeformMode ? "Creating Your Vision…" : "Generating Scene…"}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {isFreeformMode ? "✨ Generate Image" : "🌶️ Run Enhancement"}
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
                    {!approved ? (
                      <button
                        onClick={handleApprove}
                        disabled={approving}
                        className="flex-1 min-w-[160px] py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-brand-lime to-spice-600 text-white shadow-lg shadow-brand-lime/30 hover:shadow-xl hover:shadow-brand-lime/40 disabled:opacity-50"
                      >
                        {approving ? (
                          "Saving..."
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Approve & Save
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleGenerateCaption}
                        className="flex-1 min-w-[160px] py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold to-gold-600 text-white shadow-lg shadow-brand-gold/30 hover:shadow-xl hover:shadow-brand-gold/40"
                      >
                        <PenTool className="w-4 h-4" />
                        Generate Caption
                      </button>
                    )}
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
