import * as stylex from '@stylexjs/stylex';

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from '@/components/ui/autocomplete';
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { space, fontSize } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

const people = ['ada', 'grace', 'linus', 'margaret', 'dennis', 'barbara'];

export default function ReviewerCard() {
  return (
    <Card style={styles.card}>
      <CardHeader>
        <CardTitle>Assign a reviewer</CardTitle>
        <CardDescription>Start typing to filter your team.</CardDescription>
      </CardHeader>
      <CardContent>
        <div {...stylex.props(styles.stack)}>
          <Autocomplete items={people}>
            <AutocompleteInput placeholder="Search people…" />
            <AutocompleteContent>
              <AutocompleteEmpty>No one found.</AutocompleteEmpty>
              <AutocompleteList>
                {(person: string) => (
                  <AutocompleteItem key={person} value={person}>
                    {person}
                  </AutocompleteItem>
                )}
              </AutocompleteList>
            </AutocompleteContent>
          </Autocomplete>
          <div {...stylex.props(styles.suggested)}>
            <AvatarGroup>
              <Avatar size="sm">
                <AvatarImage src="https://github.com/madeui.png" alt="@madeui" />
                <AvatarFallback>MD</AvatarFallback>
              </Avatar>
              <Avatar size="sm">
                <AvatarImage src="https://github.com/github.png" alt="@github" />
                <AvatarFallback>GH</AvatarFallback>
              </Avatar>
              <Avatar size="sm">
                <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
                <AvatarFallback>VC</AvatarFallback>
              </Avatar>
            </AvatarGroup>
            <span {...stylex.props(styles.hint)}>Recently reviewed your PRs</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const styles = stylex.create({
  card: {
    width: '100%',
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s4,
  },
  suggested: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s3,
  },
  hint: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
  },
});
