"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";

// --------------------------------------
// Plug‑and‑Play Hairstyle Recommender
// --------------------------------------
// • Framework: Next.js + React (TS)
// • Styling: TailwindCSS (uses utility classes only)
// • Usage: Drop this file into /components, then import and render
//      <HairstyleRecommender /> anywhere (e.g., in app/hairstyles/page.tsx).
// • Images: Temporary placeholders are used. Replace the `image` fields below or
//           set IMAGE_BASE to your CDN/path and keep the file names.
// • Backend hooks: see the optional `fetchAutoFaceShape` function.
// --------------------------------------

// ---- Types ----
export type Gender = "Women" | "Men";
export type FaceShape = "Oval" | "Round" | "Square" | "Heart" | "Diamond" | "Oblong";
export type HairLength = "Short" | "Medium" | "Long";

export interface StyleItem {
  name: string;
  description: string;
  image: string; // path or URL; replace freely
}

export type LengthBuckets = Record<HairLength, StyleItem[]>;
export type ShapeMap = Record<FaceShape, LengthBuckets>;
export type DataMap = Record<Gender, ShapeMap>;

// ---- Config ----
const IMAGE_BASE = "/images/hairstyles"; // Change to your CDN or public folder

// Helper to build default placeholder image paths
const img = (g: Gender, shape: FaceShape, length: HairLength, slug: string) =>
  `${IMAGE_BASE}/${g.toLowerCase()}/${shape.toLowerCase()}/${length.toLowerCase()}/${slug}.jpg`;

// ---- Data ----
// Source: Internal AuraaSync haircut recommendation spec (transcribed).
// Replace `image` values at will. Names/descriptions preserved for clarity.
const DATA: DataMap = {
  Women: {
    Oval: {
      Short: [
        { name: "Pixie cut", description: "Classic or with long side‑swept bangs.", image: img("Women", "Oval", "Short", "pixie") },
        { name: "Textured bob", description: "Chin‑length with light waves.", image: img("Women", "Oval", "Short", "textured-bob") },
        { name: "Asymmetrical bob", description: "Longer in front, shorter in back.", image: img("Women", "Oval", "Short", "asym-bob") },
        { name: "Cropped shag", description: "Adds volume and movement.", image: img("Women", "Oval", "Short", "cropped-shag") },
        { name: "Short blunt bob", description: "Jawline‑grazing, sharp & chic.", image: img("Women", "Oval", "Short", "short-blunt-bob") },
      ],
      Medium: [
        { name: "Long bob (lob)", description: "Sleek or wavy, shoulder‑grazing.", image: img("Women", "Oval", "Medium", "lob") },
        { name: "Layered shoulder cut", description: "Face‑framing layers to highlight cheekbones.", image: img("Women", "Oval", "Medium", "layered-shoulder") },
        { name: "Wavy mid‑length cut", description: "Effortless—softens features.", image: img("Women", "Oval", "Medium", "wavy-mid") },
        { name: "Curtain bangs + medium length", description: "Balances oval proportions.", image: img("Women", "Oval", "Medium", "curtain-bangs-medium") },
        { name: "Shag cut (’70s inspired)", description: "Layers + texture for a trendy look.", image: img("Women", "Oval", "Medium", "shag-70s") },
      ],
      Long: [
        { name: "Soft layers", description: "Adds movement without overpowering length.", image: img("Women", "Oval", "Long", "soft-layers") },
        { name: "Beach waves", description: "Casual, highlights natural symmetry.", image: img("Women", "Oval", "Long", "beach-waves") },
        { name: "Straight sleek look", description: "Middle part; elegant and elongating.", image: img("Women", "Oval", "Long", "straight-sleek") },
        { name: "Curtain bangs + long layers", description: "Balances forehead; flatters oval.", image: img("Women", "Oval", "Long", "curtain-bangs-long") },
        { name: "Long curls", description: "Romantic, adds softness.", image: img("Women", "Oval", "Long", "long-curls") },
        { name: "Face‑framing layers", description: "Highlight jawline and cheekbones.", image: img("Women", "Oval", "Long", "face-framing-layers") },
      ],
    },
    Round: {
      Short: [
        { name: "Angled bob", description: "Longer in front, shorter in back—sharpens jawline.", image: img("Women", "Round", "Short", "angled-bob") },
        { name: "Pixie with volume on top", description: "Elongates face; avoid too round cuts.", image: img("Women", "Round", "Short", "pixie-volume-top") },
        { name: "Textured side‑part bob", description: "Breaks symmetry, adds angles.", image: img("Women", "Round", "Short", "textured-sidepart-bob") },
        { name: "Asymmetrical short cut", description: "Uneven lengths slim the face.", image: img("Women", "Round", "Short", "asym-short") },
        { name: "Long pixie with side‑swept bangs", description: "Adds diagonal lines.", image: img("Women", "Round", "Short", "long-pixie-sidebangs") },
      ],
      Medium: [
        { name: "Shoulder‑length lob", description: "Slightly below chin; elongates face.", image: img("Women", "Round", "Medium", "shoulder-lob") },
        { name: "Layered mid‑length cut", description: "Soft layers that start below chin.", image: img("Women", "Round", "Medium", "layered-mid") },
        { name: "Side‑parted waves", description: "Adds dimension; breaks roundness.", image: img("Women", "Round", "Medium", "sideparted-waves") },
        { name: "Medium cut with long side bangs", description: "Creates angles; draws eyes diagonally.", image: img("Women", "Round", "Medium", "medium-long-side-bangs") },
        { name: "Shaggy lob", description: "Volume on crown; texture around jawline.", image: img("Women", "Round", "Medium", "shaggy-lob") },
      ],
      Long: [
        { name: "Long layers", description: "Add vertical lines; slimming effect.", image: img("Women", "Round", "Long", "long-layers") },
        { name: "Loose waves with side part", description: "Softens fullness, keeps length.", image: img("Women", "Round", "Long", "loose-waves-side") },
        { name: "Straight sleek hair (center part)", description: "Slims face width.", image: img("Women", "Round", "Long", "straight-center") },
        { name: "Face‑framing layers starting below chin", description: "Avoid cheek‑level layers.", image: img("Women", "Round", "Long", "face-framing-below-chin") },
        { name: "Long hair with curtain bangs", description: "Opens up face; elongates vertically.", image: img("Women", "Round", "Long", "long-curtain-bangs") },
        { name: "V‑shaped or U‑shaped cut", description: "Lengthens the face visually.", image: img("Women", "Round", "Long", "v-or-u-cut") },
      ],
    },
    Square: {
      Short: [
        { name: "Textured bob", description: "Jaw‑length or slightly longer; waves soften.", image: img("Women", "Square", "Short", "textured-bob") },
        { name: "Side‑parted bob", description: "Diagonal line breaks jaw symmetry.", image: img("Women", "Square", "Short", "sidepart-bob") },
        { name: "Wavy lob", description: "Hits below jaw; draws attention downward.", image: img("Women", "Square", "Short", "wavy-lob") },
        { name: "Soft pixie with side‑swept fringe", description: "Rounds out angles.", image: img("Women", "Square", "Short", "soft-pixie-fringe") },
        { name: "Asymmetrical short cut", description: "Longer front pieces distract from jaw.", image: img("Women", "Square", "Short", "asym-short") },
      ],
      Medium: [
        { name: "Shoulder‑length layers", description: "Soft layers beginning below jawline.", image: img("Women", "Square", "Medium", "shoulder-layers") },
        { name: "Lob with side‑swept bangs", description: "Reduces squareness; adds curves.", image: img("Women", "Square", "Medium", "lob-sidebangs") },
        { name: "Shag cut", description: "Texture + volume soften face.", image: img("Women", "Square", "Medium", "shag") },
        { name: "Soft curls/waves", description: "Avoid sharp straight lines near jaw.", image: img("Women", "Square", "Medium", "soft-curls-waves") },
        { name: "Medium cut with curtain bangs", description: "Adds roundness; balances jaw.", image: img("Women", "Square", "Medium", "medium-curtain") },
      ],
      Long: [
        { name: "Long layers with waves", description: "Draws eye downward; softens angles.", image: img("Women", "Square", "Long", "long-layers-waves") },
        { name: "Loose curls (below chin)", description: "Adds width lower down, away from jaw.", image: img("Women", "Square", "Long", "loose-curls-below-chin") },
        { name: "Side‑part long hair", description: "Breaks symmetry of strong lines.", image: img("Women", "Square", "Long", "sidepart-long") },
        { name: "Layered V‑cut or U‑cut", description: "Elongates; softens boxiness.", image: img("Women", "Square", "Long", "v-u-cut") },
        { name: "Long curtain bangs + layers", description: "Gently frames face.", image: img("Women", "Square", "Long", "long-curtain-layers") },
        { name: "Beach waves (center part)", description: "Slim yet soft look.", image: img("Women", "Square", "Long", "beach-waves-center") },
      ],
    },
    Heart: {
      Short: [
        { name: "Side‑parted pixie", description: "Softens wide forehead; shifts focus diagonally.", image: img("Women", "Heart", "Short", "sidepart-pixie") },
        { name: "Wavy bob", description: "Chin‑length waves add volume near jawline.", image: img("Women", "Heart", "Short", "wavy-bob") },
        { name: "Asymmetrical bob", description: "Draws attention away from forehead.", image: img("Women", "Heart", "Short", "asym-bob") },
        { name: "Chin‑length layered bob", description: "Fills out narrow chin area.", image: img("Women", "Heart", "Short", "chin-layered-bob") },
        { name: "Pixie with long side bangs", description: "Balances forehead width.", image: img("Women", "Heart", "Short", "pixie-long-sidebangs") },
      ],
      Medium: [
        { name: "Collarbone cut with soft waves", description: "Adds fullness below chin.", image: img("Women", "Heart", "Medium", "collarbone-soft-waves") },
        { name: "Shoulder‑length lob with layers", description: "Balances proportions.", image: img("Women", "Heart", "Medium", "shoulder-lob-layers") },
        { name: "Medium cut with curtain bangs", description: "Softens wide forehead; adds flow.", image: img("Women", "Heart", "Medium", "medium-curtain") },
        { name: "Shaggy mid‑length style", description: "Volume throughout, not just top.", image: img("Women", "Heart", "Medium", "shaggy-mid") },
        { name: "Side‑swept bangs + medium layers", description: "Distracts from forehead.", image: img("Women", "Heart", "Medium", "sideswept-bangs-medium") },
      ],
      Long: [
        { name: "Long layers with waves/curls", description: "Softens pointed chin; adds body.", image: img("Women", "Heart", "Long", "long-layers-wavy") },
        { name: "Loose curls starting below chin", description: "Balances narrow lower face.", image: img("Women", "Heart", "Long", "loose-curls-below-chin") },
        { name: "Face‑framing layers", description: "Draw attention to cheekbones.", image: img("Women", "Heart", "Long", "face-framing") },
        { name: "Long hair with curtain bangs", description: "Reduces forehead width; elongates.", image: img("Women", "Heart", "Long", "long-curtain") },
        { name: "Side‑parted long cut", description: "Breaks symmetry; shifts focus.", image: img("Women", "Heart", "Long", "sidepart-long") },
        { name: "V‑cut or U‑cut with soft waves", description: "Adds movement; balance.", image: img("Women", "Heart", "Long", "v-u-soft-waves") },
      ],
    },
    Diamond: {
      Short: [
        { name: "Textured bob", description: "Chin‑length with soft waves to add balance.", image: img("Women", "Diamond", "Short", "textured-bob") },
        { name: "Side‑parted bob", description: "Breaks sharp cheekbone width.", image: img("Women", "Diamond", "Short", "sidepart-bob") },
        { name: "Pixie with side‑swept bangs", description: "Adds volume at forehead; softens angles.", image: img("Women", "Diamond", "Short", "pixie-sidebangs") },
        { name: "Wavy asymmetrical bob", description: "Draws attention downward.", image: img("Women", "Diamond", "Short", "wavy-asym-bob") },
        { name: "Chin‑length layered bob", description: "Fills out jawline.", image: img("Women", "Diamond", "Short", "chin-layered-bob") },
      ],
      Medium: [
        { name: "Shoulder‑length lob with layers", description: "Softens cheekbone sharpness.", image: img("Women", "Diamond", "Medium", "shoulder-lob-layers") },
        { name: "Wavy mid‑length cut", description: "Adds softness; balances proportions.", image: img("Women", "Diamond", "Medium", "wavy-mid") },
        { name: "Curtain bangs + medium layers", description: "Widens forehead; balances narrow chin.", image: img("Women", "Diamond", "Medium", "curtain-bangs-medium") },
        { name: "Shaggy mid‑cut", description: "Texture evens out face width.", image: img("Women", "Diamond", "Medium", "shaggy-mid") },
        { name: "Side‑swept medium cut", description: "Diagonal line slims cheekbone area.", image: img("Women", "Diamond", "Medium", "sideswept-medium") },
      ],
      Long: [
        { name: "Long layers with waves/curls", description: "Add width to chin and forehead; soften cheekbones.", image: img("Women", "Diamond", "Long", "long-layers-waves") },
        { name: "Side‑parted long style", description: "Breaks symmetry; flatters proportions.", image: img("Women", "Diamond", "Long", "sidepart-long") },
        { name: "Curtain bangs + long layers", description: "Opens forehead; adds harmony.", image: img("Women", "Diamond", "Long", "curtain-bangs-long") },
        { name: "Loose curls starting at chin", description: "Balances face width.", image: img("Women", "Diamond", "Long", "loose-curls-chin") },
        { name: "Straight sleek long hair (side part)", description: "Elongates; draws focus away from widest area.", image: img("Women", "Diamond", "Long", "straight-sleek-side") },
        { name: "V‑cut or U‑cut with soft waves", description: "Creates balance by adding movement.", image: img("Women", "Diamond", "Long", "v-u-soft-waves") },
      ],
    },
    Oblong: {
      Short: [
        { name: "Chin‑length bob (with waves)", description: "Adds width; makes face look shorter.", image: img("Women", "Oblong", "Short", "chin-bob-waves") },
        { name: "Soft layered bob", description: "Gives roundness to jawline.", image: img("Women", "Oblong", "Short", "soft-layered-bob") },
        { name: "Side‑parted bob with volume", description: "Breaks vertical length.", image: img("Women", "Oblong", "Short", "sidepart-bob-volume") },
        { name: "Pixie with side‑swept bangs", description: "Balances forehead; shortens face.", image: img("Women", "Oblong", "Short", "pixie-sidebangs") },
        { name: "Curled short bob", description: "Creates fullness on sides.", image: img("Women", "Oblong", "Short", "curled-short-bob") },
      ],
      Medium: [
        { name: "Shoulder‑length waves", description: "Add volume to sides; balance long proportions.", image: img("Women", "Oblong", "Medium", "shoulder-waves") },
        { name: "Medium lob with layers", description: "Prevents length from looking too heavy.", image: img("Women", "Oblong", "Medium", "medium-lob-layers") },
        { name: "Curtain bangs with mid‑length cut", description: "Reduces forehead length; adds softness.", image: img("Women", "Oblong", "Medium", "curtain-bangs-mid") },
        { name: "Wavy shag cut", description: "Volume throughout gives width.", image: img("Women", "Oblong", "Medium", "wavy-shag") },
        { name: "Side‑swept bangs with medium waves", description: "Shifts focus diagonally; shortens appearance.", image: img("Women", "Oblong", "Medium", "sideswept-bangs-waves") },
      ],
      Long: [
        { name: "Long layers with waves/curls", description: "Soften length; add body to sides.", image: img("Women", "Oblong", "Long", "long-layers-waves") },
        { name: "Curtain bangs with long cut", description: "Break up vertical length.", image: img("Women", "Oblong", "Long", "curtain-bangs-long") },
        { name: "Loose curls at chin & cheeks", description: "Widen face; balance proportions.", image: img("Women", "Oblong", "Long", "loose-curls-cheeks") },
        { name: "Face‑framing layers (cheek‑level)", description: "Draw attention to cheekbones, not length.", image: img("Women", "Oblong", "Long", "face-framing-cheek") },
        { name: "V‑cut with waves", description: "Adds movement and width.", image: img("Women", "Oblong", "Long", "v-cut-waves") },
        { name: "Long hair with side part", description: "Reduces elongated effect of center part.", image: img("Women", "Oblong", "Long", "long-sidepart") },
      ],
    },
  },
  Men: {
    Oval: {
      Short: [
        { name: "Classic Crew Cut", description: "Neat, balanced, timeless.", image: img("Men", "Oval", "Short", "crew") },
        { name: "Buzz Cut (slightly longer on top)", description: "Keeps proportions clean.", image: img("Men", "Oval", "Short", "buzz") },
        { name: "Textured Crop", description: "Short with texture; modern look.", image: img("Men", "Oval", "Short", "textured-crop") },
        { name: "Ivy League Cut", description: "Short sides, slightly longer top.", image: img("Men", "Oval", "Short", "ivy-league") },
        { name: "Caesar Cut (short fringe)", description: "Structured but not too heavy.", image: img("Men", "Oval", "Short", "caesar") },
      ],
      Medium: [
        { name: "Pompadour", description: "Volume on top; tapered sides.", image: img("Men", "Oval", "Medium", "pompadour") },
        { name: "Quiff", description: "Casual; lifted style adds height.", image: img("Men", "Oval", "Medium", "quiff") },
        { name: "Side Part", description: "Neat, business‑ready; shows balance.", image: img("Men", "Oval", "Medium", "side-part") },
        { name: "Medium textured fringe (angled)", description: "Works if kept light.", image: img("Men", "Oval", "Medium", "medium-textured-fringe") },
        { name: "Messy medium layers", description: "Natural, relaxed.", image: img("Men", "Oval", "Medium", "messy-medium") },
      ],
      Long: [
        { name: "Shoulder‑length straight or wavy", description: "Shows off symmetry.", image: img("Men", "Oval", "Long", "shoulder-straight-wavy") },
        { name: "Man bun", description: "Pulls face upward; elongates slightly.", image: img("Men", "Oval", "Long", "man-bun") },
        { name: "Long slick back", description: "Stylish; keeps face balanced.", image: img("Men", "Oval", "Long", "long-slick-back") },
        { name: "Wavy flow (hockey hair)", description: "Relaxed; frames evenly.", image: img("Men", "Oval", "Long", "wavy-flow") },
        { name: "Long layers with natural texture", description: "Keeps proportions open.", image: img("Men", "Oval", "Long", "long-layers-texture") },
      ],
    },
    Round: {
      Short: [
        { name: "High & Tight Fade", description: "Sharp sides; adds length.", image: img("Men", "Round", "Short", "high-tight-fade") },
        { name: "Crew Cut with Fade", description: "Clean and structured.", image: img("Men", "Round", "Short", "crew-fade") },
        { name: "Angular Fringe (not straight)", description: "Angles break roundness.", image: img("Men", "Round", "Short", "angular-fringe") },
        { name: "Caesar with Texture", description: "Short fringe, styled up/forward.", image: img("Men", "Round", "Short", "caesar-texture") },
        { name: "Short Spiky Top", description: "Creates vertical lift.", image: img("Men", "Round", "Short", "short-spiky-top") },
      ],
      Medium: [
        { name: "Pompadour with Fade", description: "Adds height; elongates face.", image: img("Men", "Round", "Medium", "pompadour-fade") },
        { name: "Textured Quiff", description: "Volume at front balances width.", image: img("Men", "Round", "Medium", "textured-quiff") },
        { name: "Side Part with Undercut", description: "Sharp contrast slims face.", image: img("Men", "Round", "Medium", "sidepart-undercut") },
        { name: "Medium Faux Hawk", description: "Elongates vertically.", image: img("Men", "Round", "Medium", "medium-faux-hawk") },
        { name: "Brushed‑up Layers", description: "Messy height on top.", image: img("Men", "Round", "Medium", "brushed-up-layers") },
      ],
      Long: [
        { name: "Long Top + Short Sides (Disconnected)", description: "Makes face appear longer.", image: img("Men", "Round", "Long", "longtop-shortsides") },
        { name: "Shoulder‑length with Side Part", description: "Breaks symmetry.", image: img("Men", "Round", "Long", "shoulder-sidepart") },
        { name: "Slick Back (longer on top)", description: "Elongates vertically.", image: img("Men", "Round", "Long", "slick-back-longer-top") },
        { name: "Wavy layers pushed back", description: "Adds height; avoids width.", image: img("Men", "Round", "Long", "wavy-pushed-back") },
        { name: "Man Bun / Top Knot (high)", description: "Maximizes vertical length.", image: img("Men", "Round", "Long", "man-bun-high") },
      ],
    },
    Square: {
      Short: [
        { name: "Buzz Cut", description: "Emphasizes masculine jawline.", image: img("Men", "Square", "Short", "buzz") },
        { name: "Crew Cut with Fade", description: "Clean, sharp edges.", image: img("Men", "Square", "Short", "crew-fade") },
        { name: "High & Tight", description: "Military‑style; neat and bold.", image: img("Men", "Square", "Short", "high-tight") },
        { name: "Short Spiky Hair", description: "Adds texture; neat sides.", image: img("Men", "Square", "Short", "short-spiky") },
        { name: "Textured Caesar Cut", description: "Slight forward fringe; adds detail.", image: img("Men", "Square", "Short", "textured-caesar") },
      ],
      Medium: [
        { name: "Classic Side Part", description: "Timeless; highlights structure.", image: img("Men", "Square", "Medium", "classic-sidepart") },
        { name: "Undercut with Volume on Top", description: "Contrast balances sharp jawline.", image: img("Men", "Square", "Medium", "undercut-volume-top") },
        { name: "Textured Quiff", description: "Adds lift; balances proportions.", image: img("Men", "Square", "Medium", "textured-quiff") },
        { name: "Pompadour (medium)", description: "Bold, sharp with volume.", image: img("Men", "Square", "Medium", "pompadour-medium") },
        { name: "Faux Hawk (controlled sides)", description: "Elongates face.", image: img("Men", "Square", "Medium", "faux-hawk-controlled") },
      ],
      Long: [
        { name: "Slick Back (longer length)", description: "Structured, masculine.", image: img("Men", "Square", "Long", "slick-back-long") },
        { name: "Shoulder‑Length Waves (pushed back/side part)", description: "Rugged but neat.", image: img("Men", "Square", "Long", "shoulder-waves-pushed-back") },
        { name: "Layered Long Hair with Fade", description: "Modern masculine vibe.", image: img("Men", "Square", "Long", "layered-long-fade") },
        { name: "Man Bun / Top Knot (tight sides)", description: "Keeps definition strong.", image: img("Men", "Square", "Long", "man-bun-tight-sides") },
        { name: "Long Flow with Tapered Sides", description: "Adds balance; avoids boxy look.", image: img("Men", "Square", "Long", "long-flow-tapered") },
      ],
    },
    Heart: {
      Short: [
        { name: "Classic Taper Fade + Texture Top", description: "Balances forehead.", image: img("Men", "Heart", "Short", "taper-texture-top") },
        { name: "Crew Cut (slightly textured)", description: "Clean; not too flat.", image: img("Men", "Heart", "Short", "crew-textured") },
        { name: "Side‑Swept Short Cut", description: "Softens forehead width.", image: img("Men", "Heart", "Short", "sideswept-short") },
        { name: "Low Fade + Brushed Forward Top", description: "Adds balance.", image: img("Men", "Heart", "Short", "lowfade-brush-forward") },
        { name: "Textured Crop", description: "Fringe helps reduce broad‑forehead appearance.", image: img("Men", "Heart", "Short", "textured-crop") },
      ],
      Medium: [
        { name: "Medium Side Part with Layers", description: "Reduces width at temples.", image: img("Men", "Heart", "Medium", "medium-sidepart-layers") },
        { name: "Light Fringe / Forward Bangs", description: "Balances big forehead.", image: img("Men", "Heart", "Medium", "light-fringe") },
        { name: "Textured Quiff (not too high)", description: "Adds dimension without excess height.", image: img("Men", "Heart", "Medium", "textured-quiff-low") },
        { name: "Messy Medium Hair", description: "Casual volume softens face.", image: img("Men", "Heart", "Medium", "messy-medium") },
        { name: "Medium Undercut with Flow", description: "Stylish; draws attention away from chin.", image: img("Men", "Heart", "Medium", "medium-undercut-flow") },
      ],
      Long: [
        { name: "Wavy Shoulder‑Length Hair", description: "Adds fullness near jawline.", image: img("Men", "Heart", "Long", "wavy-shoulder") },
        { name: "Layered Long Hair (messy look)", description: "Makes chin look stronger.", image: img("Men", "Heart", "Long", "layered-long-messy") },
        { name: "Man Bun with Loose Strands", description: "Stylish; balances sharp forehead.", image: img("Men", "Heart", "Long", "man-bun-loose") },
        { name: "Long Fringe with Layers", description: "Softens forehead.", image: img("Men", "Heart", "Long", "long-fringe-layers") },
        { name: "Chin‑Length Flow (bold look)", description: "Balances narrow chin.", image: img("Men", "Heart", "Long", "chin-length-flow") },
      ],
    },
    Diamond: {
      Short: [
        { name: "Classic Caesar Cut", description: "Fringe softens cheekbone width.", image: img("Men", "Diamond", "Short", "caesar") },
        { name: "Crew Cut with Texture", description: "Adds balance; avoids sharper cheekbones.", image: img("Men", "Diamond", "Short", "crew-texture") },
        { name: "Short Side‑Swept Fringe", description: "Reduces wide cheekbone effect.", image: img("Men", "Diamond", "Short", "short-sideswept-fringe") },
        { name: "Low Fade + Brushed Forward Top", description: "Balances forehead & jaw.", image: img("Men", "Diamond", "Short", "lowfade-brush-forward") },
        { name: "Buzz Cut (with beard)", description: "Beard adds jaw strength; avoids pointy look.", image: img("Men", "Diamond", "Short", "buzz-beard") },
      ],
      Medium: [
        { name: "Side Part with Layers", description: "Fills forehead area; softens cheekbones.", image: img("Men", "Diamond", "Medium", "sidepart-layers") },
        { name: "Textured Crop with Fringe", description: "Adds fullness where needed.", image: img("Men", "Diamond", "Medium", "textured-crop-fringe") },
        { name: "Medium Quiff (not too tall)", description: "Elongates forehead slightly.", image: img("Men", "Diamond", "Medium", "medium-quiff-low") },
        { name: "Messy Medium Waves", description: "Balances face with natural flow.", image: img("Men", "Diamond", "Medium", "messy-medium-waves") },
        { name: "Undercut with Medium Top", description: "Keep volume forward not sides.", image: img("Men", "Diamond", "Medium", "undercut-medium-top") },
      ],
      Long: [
        { name: "Shoulder‑Length Waves", description: "Adds width to jawline; balances face.", image: img("Men", "Diamond", "Long", "shoulder-waves") },
        { name: "Layered Long Hair", description: "Creates fullness around forehead & chin.", image: img("Men", "Diamond", "Long", "layered-long") },
        { name: "Man Bun / Top Knot (front volume)", description: "Reduces wide‑cheekbone look.", image: img("Men", "Diamond", "Long", "manbun-front-volume") },
        { name: "Long Side‑Swept Hair", description: "Softens angularity.", image: img("Men", "Diamond", "Long", "long-sideswept") },
        { name: "Long Curly Hair", description: "Great for balancing sharp angles.", image: img("Men", "Diamond", "Long", "long-curly") },
      ],
    },
    Oblong: {
      Short: [
        { name: "Crew Cut (slight texture)", description: "Keeps proportions balanced.", image: img("Men", "Oblong", "Short", "crew-texture") },
        { name: "Classic Side Part", description: "Adds width; reduces vertical length.", image: img("Men", "Oblong", "Short", "classic-sidepart") },
        { name: "Ivy League Cut", description: "Neat; doesn’t elongate face.", image: img("Men", "Oblong", "Short", "ivy-league") },
        { name: "Short Textured Crop + Fringe", description: "Fringe reduces forehead height.", image: img("Men", "Oblong", "Short", "short-textured-fringe") },
        { name: "Low Fade + Short Comb Over", description: "Neat; avoids extra height.", image: img("Men", "Oblong", "Short", "lowfade-combover") },
      ],
      Medium: [
        { name: "Side‑Swept Fringe", description: "Makes forehead look shorter.", image: img("Men", "Oblong", "Medium", "sideswept-fringe") },
        { name: "Medium Pompadour (low height)", description: "Controlled volume.", image: img("Men", "Oblong", "Medium", "medium-pompadour-low") },
        { name: "Brushed Back with Natural Waves", description: "Adds width at sides.", image: img("Men", "Oblong", "Medium", "brushedback-waves") },
        { name: "Textured Quiff (kept short)", description: "Style without elongating.", image: img("Men", "Oblong", "Medium", "textured-quiff-short") },
        { name: "Medium‑length layers", description: "Fullness at sides balances length.", image: img("Men", "Oblong", "Medium", "medium-layers") },
      ],
      Long: [
        { name: "Shoulder‑Length Waves", description: "Adds volume to sides; softens length.", image: img("Men", "Oblong", "Long", "shoulder-waves") },
        { name: "Layered Long Hair (not flat)", description: "Prevents stretched look.", image: img("Men", "Oblong", "Long", "layered-long-notflat") },
        { name: "Low Man Bun (not high)", description: "Avoids extra vertical length.", image: img("Men", "Oblong", "Long", "low-man-bun") },
        { name: "Long Hair with Side Part", description: "Breaks up the length visually.", image: img("Men", "Oblong", "Long", "long-sidepart") },
        { name: "Loose Natural Curls/Waves", description: "Best for softening a long look.", image: img("Men", "Oblong", "Long", "loose-natural-curls") },
      ],
    },
  },
};

// ---- UI helpers ----
const genders: Gender[] = ["Women", "Men"];
const faceShapes: FaceShape[] = ["Oval", "Round", "Square", "Heart", "Diamond", "Oblong"];
const lengths: HairLength[] = ["Short", "Medium", "Long"];

function classNames(...arr: (string | false | null | undefined)[]) {
  return arr.filter(Boolean).join(" ");
}

// Get user data from localStorage (from onboarding)
function getUserDataFromStorage(): { gender: Gender; faceShape: FaceShape } | null {
  try {
    const userData = JSON.parse(localStorage.getItem('aurasync_user_data') || '{}');
    
    if (!userData.gender || !userData.face_shape) {
      return null;
    }

    // Map your gender format to the component's format
    const genderMap: Record<string, Gender> = {
      'male': 'Men',
      'female': 'Women'
    };

    // Map your face shape format to the component's format
    const faceShapeMap: Record<string, FaceShape> = {
      'Oval': 'Oval',
      'Round': 'Round', 
      'Square': 'Square',
      'Heart': 'Heart',
      'Diamond': 'Diamond',
      'Rectangle': 'Oblong' // Map Rectangle to Oblong
    };

    const gender = genderMap[userData.gender];
    const faceShape = faceShapeMap[userData.face_shape];

    if (!gender || !faceShape) {
      return null;
    }

    return { gender, faceShape };
  } catch {
    return null;
  }
}

export default function HairstyleRecommender() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [gender, setGender] = useState<Gender | null>(null);
  const [faceShape, setFaceShape] = useState<FaceShape | null>(null);
  const [query, setQuery] = useState("");

  // Auto‑hydrate from user data (from onboarding)
  React.useEffect(() => {
    const userData = getUserDataFromStorage();
    if (userData) {
      setGender(userData.gender);
      setFaceShape(userData.faceShape);
      setStep(3);
    }
  }, []);

  const results = useMemo(() => {
    if (!gender || !faceShape) return null;
    const bucket = DATA[gender][faceShape];
    if (!bucket) return null;

    // Simple client‑side search across names/descriptions
    if (!query.trim()) return bucket;
    const q = query.toLowerCase();
    const filtered: LengthBuckets = {
      Short: bucket.Short.filter((s) => `${s.name} ${s.description}`.toLowerCase().includes(q)),
      Medium: bucket.Medium.filter((s) => `${s.name} ${s.description}`.toLowerCase().includes(q)),
      Long: bucket.Long.filter((s) => `${s.name} ${s.description}`.toLowerCase().includes(q)),
    };
    return filtered;
  }, [gender, faceShape, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-white">AuraSync • Hairstyle Recommendations</h1>
        <div className="text-sm opacity-70 text-white">Personalized for your face shape</div>
      </div>

      {/* Stepper */}
      <ol className="mb-8 flex items-center gap-3 text-sm text-white">
        {[1, 2, 3].map((i) => (
          <li key={i} className="flex items-center gap-2">
            <span
              className={classNames(
                "flex h-7 w-7 items-center justify-center rounded-full border",
                step >= (i as 1 | 2 | 3) ? "bg-blue-600 text-white border-blue-600" : "bg-transparent border-white/30 text-white"
              )}
            >
              {i}
            </span>
            <span className="hidden sm:inline">
              {i === 1 ? "Select Gender" : i === 2 ? "Select Face Shape" : "Recommendations"}
            </span>
            {i !== 3 && <span className="mx-2 text-white/40">—</span>}
          </li>
        ))}
      </ol>

      {/* Step 1: Gender */}
      {step === 1 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {genders.map((g) => (
            <button
              key={g}
              onClick={() => {
                setGender(g);
                setStep(2);
              }}
              className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-6 text-left shadow-sm transition hover:shadow-md hover:bg-white/20"
            >
              <div className="text-lg font-medium text-white">{g}</div>
              <div className="mt-2 text-sm opacity-70 text-white">See styles curated for {g.toLowerCase()}.</div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Face Shape */}
      {step === 2 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm opacity-75 text-white">Gender: <b>{gender}</b></div>
            <button onClick={() => setStep(1)} className="text-sm underline opacity-75 text-white hover:text-blue-300">Change</button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {faceShapes.map((shape) => (
              <button
                key={shape}
                onClick={() => {
                  setFaceShape(shape);
                  setStep(3);
                }}
                className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-5 text-left shadow-sm transition hover:shadow-md hover:bg-white/20"
              >
                <div className="text-base font-medium text-white">{shape}</div>
                <div className="mt-2 text-xs opacity-70 text-white">Tap to view recommended styles.</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && gender && faceShape && results && (
        <div className="space-y-6">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="text-sm opacity-75 text-white">
              Gender: <b>{gender}</b> • Face shape: <b>{faceShape}</b>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search within styles (e.g., bangs, waves, layers)"
                className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/50 sm:w-80"
              />
              <button onClick={() => setStep(2)} className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white hover:bg-white/20">Change face shape</button>
            </div>
          </div>

          {lengths.map((len) => (
            <section key={len}>
              <h2 className="mb-3 text-lg font-semibold text-white">{len} Hair</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results[len].length === 0 && (
                  <div className="col-span-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-6 text-sm opacity-70 text-white">
                    No matches for "{query}" in {len.toLowerCase()} hair.
                  </div>
                )}
                {results[len].map((style) => (
                  <article key={style.name} className="group overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm shadow-sm transition hover:shadow-md hover:bg-white/20">
                    <div className="relative h-48 w-full">
                      {/* Replace with your images; next/image optimizes automatically */}
                      <Image
                        src={style.image}
                        alt={style.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <div className="text-base font-medium text-white">{style.name}</div>
                      <p className="mt-1 text-sm opacity-80 text-white">{style.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-4 text-xs opacity-70 text-white">
            Tip: Replace images by updating <code className="bg-white/20 px-1 rounded">image</code> fields in the DATA map or by keeping the same
            filenames inside <code className="bg-white/20 px-1 rounded">{IMAGE_BASE}</code>. You can also wire this UI to your FastAPI endpoint and fetch
            the JSON instead of using the in‑file constant.
          </div>
        </div>
      )}

      {/* Empty state when step 3 has no data (shouldn’t happen) */}
      {step === 3 && (!gender || !faceShape) && (
        <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-6 text-sm opacity-75 text-white">Please complete the steps above.</div>
      )}
    </div>
  );
}
