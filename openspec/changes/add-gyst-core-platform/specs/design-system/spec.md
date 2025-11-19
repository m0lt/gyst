## ADDED Requirements

### Requirement: Art Nouveau Visual Language
Design system SHALL implement Art Nouveau/Jugendstil aesthetic inspired by Alphonse Mucha.

#### Scenario: Apply organic shapes and curves
- **WHEN** components are rendered (buttons, cards, modals)
- **THEN** elements use soft border radii (border-radius: 16px+)
- **AND** decorative elements feature flowing, curved lines
- **AND** geometric hard edges are avoided
- **AND** layout incorporates asymmetric balance

#### Scenario: Ornamental framing
- **WHEN** important sections are displayed (hero, feature cards)
- **THEN** optional ornamental borders are applied
- **AND** SVG decorative elements (florals, vines) can be included
- **AND** ornaments are modular and toggleable
- **AND** ornaments do not interfere with content readability

---

### Requirement: Mucha-Inspired Color Palettes
Design system SHALL provide multiple Art Nouveau color themes.

#### Scenario: Default "Mucha Classic" theme
- **WHEN** user has default theme selected
- **THEN** primary colors are: cream (#F5EFE6), peach (#E8B4A0), sage (#A8C4A0), gold (#D4AF37)
- **AND** accent colors are: petrol (#4A90A4), ruby (#D15B5B), amber (#E8A87C)
- **AND** all colors meet WCAG AA contrast requirements for text

#### Scenario: "Mucha Emerald" theme
- **WHEN** user selects Emerald palette
- **THEN** color scheme shifts to: emerald greens, ivory, deep teal, bronze
- **AND** all components update colors instantly
- **AND** theme change animates smoothly (300ms transition)

#### Scenario: "Mucha Ruby" theme
- **WHEN** user selects Ruby palette
- **THEN** warm reds, gold, burgundy, cream tones are applied
- **AND** progress indicators use ruby gradient
- **AND** theme persists in user profile

#### Scenario: Dark mode adaptation
- **WHEN** user enables dark mode with any theme
- **THEN** colors are shifted to darker variants (e.g., charcoal background)
- **AND** ornamental elements become lighter/gold tinted
- **AND** contrast remains WCAG AA compliant
- **AND** Art Nouveau aesthetic is preserved

---

### Requirement: Typography Hierarchy
Design system SHALL use elegant typography that complements Art Nouveau style.

#### Scenario: Heading typography
- **WHEN** headings (H1-H6) are rendered
- **THEN** serif font with ornamental details is used (e.g., Cormorant Garamond Variable)
- **AND** font weights vary by level: H1 (300 light), H2 (400), H3 (500)
- **AND** generous line-height (1.6) creates airy feel
- **AND** headings support optional decorative underline

#### Scenario: Body text typography
- **WHEN** body text and UI labels are rendered
- **THEN** modern sans-serif is used (Inter Variable or system font stack)
- **AND** font size is 16px minimum for readability
- **AND** line-height is 1.75 for body paragraphs
- **AND** text color has 4.5:1 contrast minimum

#### Scenario: Display/decorative text
- **WHEN** hero sections or special callouts use display font
- **THEN** Art Nouveau-inspired font is applied (e.g., Poiret One)
- **AND** used sparingly (max 2-3 short phrases per page)
- **AND** fallback to serif if custom font fails to load

---

### Requirement: Component Variants with CVA
All UI components SHALL have consistent variant system using class-variance-authority.

#### Scenario: Button variants
- **WHEN** Button component is rendered
- **THEN** following variants are available:
  - primary: bg-petrol, text-ivory, rounded-full
  - secondary: bg-sage, text-charcoal, rounded-full
  - ornamental: border-2 border-gold, bg-ivory/50, backdrop-blur
  - ghost: transparent bg, border-1, hover effect
- **AND** sizes: sm (px-4 py-2), md (px-6 py-3), lg (px-8 py-4)
- **AND** hover states have smooth 300ms transition

#### Scenario: Card variants
- **WHEN** Card component is rendered
- **THEN** variants include:
  - default: white bg, subtle shadow, rounded-2xl
  - ornamental: decorative border, optional corner SVG flourishes
  - glass: bg-ivory/30, backdrop-blur-lg
- **AND** all cards support dark mode variants
- **AND** cards have consistent padding (p-6 default)

---

### Requirement: Icon System
Icons SHALL use organic, Art Nouveau-style line work.

#### Scenario: Lucide icons with custom styling
- **WHEN** icons are displayed (from lucide-react)
- **THEN** stroke-width is reduced to 1.5 (softer than default 2)
- **AND** icons can be optionally styled with organic flourishes
- **AND** icon colors match theme palette
- **AND** icons have min size of 24x24px for accessibility

#### Scenario: Custom decorative icons
- **WHEN** decorative elements are needed (category icons, achievements)
- **THEN** custom SVG illustrations with Art Nouveau motifs are used
- **AND** illustrations feature: flowing hair, floral patterns, curved frames
- **AND** illustrations are modular and theme-aware (color-aware)

---

### Requirement: Animation Principles
Animations SHALL feel organic and fluid, inspired by natural movement.

#### Scenario: Micro-interactions
- **WHEN** user interacts with buttons, inputs, or cards
- **THEN** animations use spring physics (Framer Motion)
- **AND** spring config: stiffness 100, damping 15, mass 0.8
- **AND** movements feel like gentle swaying or vine growth

#### Scenario: Page transitions
- **WHEN** user navigates between pages
- **THEN** fade + slide transitions are applied
- **AND** transition duration is 400ms with easeInOut
- **AND** no harsh cuts or instant changes

#### Scenario: Reduced motion support
- **WHEN** user has prefers-reduced-motion enabled
- **THEN** all animations are either disabled or reduced to opacity fades
- **AND** essential feedback (e.g., completion) uses static visual changes
- **AND** no auto-playing animations occur

---

### Requirement: Accessibility (WCAG 2.2 AA)
Design system SHALL meet modern accessibility standards.

#### Scenario: Color contrast compliance
- **WHEN** any text is rendered on backgrounds
- **THEN** contrast ratio is ≥ 4.5:1 for normal text
- **AND** ≥ 3:1 for large text (18px+ or 14px+ bold)
- **AND** automated tests verify all combinations

#### Scenario: Keyboard navigation
- **WHEN** user navigates with keyboard only
- **THEN** all interactive elements are reachable via Tab
- **AND** focus indicators are visible (2px outline, theme color)
- **AND** focus order follows logical DOM structure
- **AND** skip links allow jumping to main content

#### Scenario: Screen reader support
- **WHEN** screen reader user navigates site
- **THEN** all interactive elements have descriptive aria-labels
- **AND** images have alt text (decorative marked as alt="")
- **AND** form inputs have associated labels
- **AND** status messages use aria-live regions

#### Scenario: Touch targets
- **WHEN** user interacts on mobile/touch device
- **THEN** all buttons/links have min 44x44px touch target
- **AND** adequate spacing prevents mis-taps
- **AND** swipe gestures have fallback tap actions

---

### Requirement: Storybook Documentation
All components SHALL be documented in Storybook with interactive examples.

#### Scenario: Component story with variants
- **WHEN** developer views Button component in Storybook
- **THEN** all variants (primary, secondary, ornamental, ghost) are shown
- **AND** interactive controls allow testing props
- **AND** accessibility addon shows a11y violations
- **AND** dark mode toggle allows theme testing

#### Scenario: Theme palette showcase
- **WHEN** developer views "Themes" section in Storybook
- **THEN** all Mucha-inspired palettes are displayed with color swatches
- **AND** clicking palette name applies it to all stories
- **AND** WCAG contrast ratios are shown for each color pair

---

### Requirement: Responsive Design Breakpoints
Layout SHALL adapt gracefully across device sizes.

#### Scenario: Mobile-first approach
- **WHEN** components are developed
- **THEN** base styles target mobile (< 640px)
- **AND** progressive enhancement for larger screens via Tailwind breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

#### Scenario: Fluid typography
- **WHEN** viewport size changes
- **THEN** font sizes scale smoothly using clamp()
- **AND** heading sizes: clamp(1.5rem, 4vw, 3rem) for H1
- **AND** body text remains 16px minimum at all sizes

---

### Requirement: White Space and Layout
Design SHALL use generous white space for Art Nouveau "airy" aesthetic.

#### Scenario: Container spacing
- **WHEN** content containers are rendered
- **THEN** padding is generous: p-6 on mobile, p-8 on desktop
- **AND** section vertical spacing is 4rem minimum
- **AND** content width is constrained to max-w-7xl for readability

#### Scenario: Grid system
- **WHEN** dashboard or card layouts are built
- **THEN** CSS Grid is used for 2D layouts
- **AND** gap is 1.5rem minimum between grid items
- **AND** asymmetric layouts are encouraged (not rigid columns)

---

### Requirement: Ornamental SVG Assets
System SHALL provide modular ornamental elements.

#### Scenario: Corner flourishes
- **WHEN** ornamental card variant is used
- **THEN** SVG flourishes can be added to corners
- **AND** flourishes are theme-aware (use current palette colors)
- **AND** flourishes are aria-hidden for screen readers

#### Scenario: Section dividers
- **WHEN** sections need visual separation
- **THEN** decorative divider SVGs can be inserted
- **AND** dividers feature floral or vine motifs
- **AND** dividers scale responsively

---

### Requirement: Performance
Design system components SHALL be performant and optimized.

#### Scenario: Bundle size
- **WHEN** design system is imported
- **THEN** core bundle is < 50KB minzipped
- **AND** components are tree-shakeable
- **AND** CSS is purged of unused styles via Tailwind

#### Scenario: Animation performance
- **WHEN** animations run
- **THEN** they use GPU-accelerated properties (transform, opacity)
- **AND** no layout thrashing occurs
- **AND** animations run at consistent 60fps
