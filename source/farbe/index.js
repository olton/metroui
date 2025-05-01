import { Farbe, MetroColorPalette, Palette, Primitives, Routines, StandardColorPalette, info } from "@olton/farbe";

globalThis.Farbe = Farbe;
globalThis.farbe = (c) => new Farbe(c);

globalThis.Farbe.Routines = Routines;
globalThis.Farbe.Palette = Palette;
globalThis.Farbe.StandardColors = StandardColorPalette;
globalThis.Farbe.MetroColors = MetroColorPalette;
globalThis.Farbe.Primitives = Primitives;
globalThis.Farbe.info = info;
