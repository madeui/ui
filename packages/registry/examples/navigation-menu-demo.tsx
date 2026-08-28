import * as stylex from '@stylexjs/stylex';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { space, fontSize, fontWeight, container } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div {...stylex.props(styles.panel)}>
              <NavigationMenuLink href="#">
                <div {...stylex.props(styles.linkBody)}>
                  <span {...stylex.props(styles.linkTitle)}>Introduction</span>
                  <span {...stylex.props(styles.linkText)}>
                    Base UI + StyleX components you own.
                  </span>
                </div>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <div {...stylex.props(styles.linkBody)}>
                  <span {...stylex.props(styles.linkTitle)}>Installation</span>
                  <span {...stylex.props(styles.linkText)}>
                    Set up StyleX and install components via the CLI.
                  </span>
                </div>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div {...stylex.props(styles.panel)}>
              <NavigationMenuLink href="#">
                <div {...stylex.props(styles.linkBody)}>
                  <span {...stylex.props(styles.linkTitle)}>Button</span>
                  <span {...stylex.props(styles.linkText)}>
                    Variants, sizes, and render-prop composition.
                  </span>
                </div>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <div {...stylex.props(styles.linkBody)}>
                  <span {...stylex.props(styles.linkTitle)}>Dialog</span>
                  <span {...stylex.props(styles.linkText)}>
                    Modal dialogs with overlay and close button.
                  </span>
                </div>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Docs</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const styles = stylex.create({
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s1,
    width: container.md,
  },
  linkBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s1,
  },
  linkTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  linkText: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
  },
});
