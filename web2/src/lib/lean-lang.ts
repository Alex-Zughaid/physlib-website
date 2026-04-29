import type { LanguageFn } from "highlight.js";

const lean: LanguageFn = (hljs) => {
  const KEYWORD_STR =
    "theorem lemma definition semiformal_result informal_lemma TODO informal_definition def class structure instance example inductive coinductive axiom axioms hypothesis constant constants universe universes variable variables parameter parameters begin end infix infixr import open theory prelude renaming hiding exposing calc match do by let in extends fun assume #check #eval #reduce #print λ ∀ ∃ ⊕ Π";
  const BUILT_IN_STR =
    "Type Prop Sort rw rewrite rwa erw subst substs simp dsimp simpa simp_intros finish unfold unfold1 dunfold unfold_projs unfold_coes delta cc ac_reflexivity ac_refl existsi cases rcases with intro intros introv by_cases refl rfl funext propext exact exacts refine apply eapply fapply apply_with apply_instance induction rename assumption revert generalize specialize clear contradiction by_contradiction by_contra trivial exfalso symmetry transitivity destruct constructor econstructor left right split injection injections repeat try continue skip swap solve1 abstract all_goals any_goals done fail_if_success success_if_fail guard_target guard_hyp have replace at suffices show from congr congr_n congr_arg norm_num ring";

  return {
    name: "lean",
    keywords: {
      keyword: KEYWORD_STR,
      built_in: BUILT_IN_STR,
      literal: "tt ff",
    },
    contains: [
      hljs.QUOTE_STRING_MODE,
      hljs.NUMBER_MODE,
      hljs.COMMENT("--", "$"),
      hljs.COMMENT("/-[^-]", "-/"),
      { className: "doctag", begin: "/-[-!]", end: "-/" },
      { className: "meta", begin: "@\\[", end: "\\]" },
      { className: "meta", begin: "^attribute", end: "$" },
    ],
  };
};

export default lean;
