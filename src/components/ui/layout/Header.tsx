import { Appbar, useTheme } from 'react-native-paper';

export default function Header() {
  const theme = useTheme();

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
      <Appbar.Content title="WikiScape" />
    </Appbar.Header>
  );
}
