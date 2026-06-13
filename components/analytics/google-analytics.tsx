import { GoogleAnalytics } from "@next/third-parties/google";
import { Suspense } from "react";
import { getGaMeasurementId } from "@/lib/env/public";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";

export function AppGoogleAnalytics() {
  const gaId = getGaMeasurementId();
  if (!gaId) return null;

  return (
    <>
      <GoogleAnalytics gaId={gaId} />
      <Suspense fallback={null}>
        <PageViewTracker gaId={gaId} />
      </Suspense>
    </>
  );
}
