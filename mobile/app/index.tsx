import { type Href, Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href={'/(onboarding)/splash' as Href} />;
}
