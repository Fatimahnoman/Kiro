import type { LucideIcon } from "lucide-react";
import { Bug, FlaskConical, Ghost, Skull, Wand2 } from "lucide-react";

/** A "Ritual Spell" — a cursed code snippet the exorcist can cleanse. */
export interface RitualSpell {
  id: string;
  label: string;
  /** The cursed code loaded into the editor when selected. */
  code: string;
  icon: LucideIcon;
  accent: "blood" | "haunt" | "spectral";
}

export const RITUAL_SPELLS: RitualSpell[] = [
  {
    id: "loose-equality",
    label: "Banish Loose Equality",
    icon: Ghost,
    accent: "haunt",
    code: `function isAdmin(user) {
  if (user.role == "admin") {
    return true
  }
  return false
}`,
  },
  {
    id: "assignment-demon",
    label: "Exorcise the = Demon",
    icon: Skull,
    accent: "blood",
    code: `function findUser(id) {
  var result = null
  for (var i = 0; i < users.length; i++) {
    if (users[i].id = id) {
      result = users[i]
    }
  }
  return result
}`,
  },
  {
    id: "var-poltergeist",
    label: "Dispel var Poltergeist",
    icon: Wand2,
    accent: "spectral",
    code: `var total = 0
for (var i = 0; i < items.length; i++) {
  var price = items[i].price
  total = total + price
}`,
  },
  {
    id: "console-haunt",
    label: "Silence console Spirits",
    icon: Bug,
    accent: "haunt",
    code: `function checkout(cart) {
  console.log("checking out", cart)
  var sum = cart.reduce((a, b) => a + b.price, 0)
  console.debug("sum", sum)
  return sum
}`,
  },
  {
    id: "cursed-sample",
    label: "The Fully Cursed Snippet",
    icon: FlaskConical,
    accent: "blood",
    code: `function getUser(id) {
  var result = null
  if (id == null) {
    console.log("no id")
  }
  for (var i = 0; i < users.length; i++) {
    if (users[i].id = id) {
      result == users[i]
    }
  }
  return result
}`,
  },
];
