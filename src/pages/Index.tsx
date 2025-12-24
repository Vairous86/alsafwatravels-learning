import Header from "@/components/Header";
import AudioList from "@/components/AudioList";
import SecurityProvider from "@/components/SecurityProvider";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <SecurityProvider>
      <Helmet>
        <title>مكتبة التدريبات السياحية | دروس صوتية للوجهات السياحية</title>
        <meta
          name="description"
          content="استمع إلى دروس تعليمية صوتية حول الوجهات السياحية المختلفة مثل تركيا وماليزيا وإندونيسيا وتايلاند وفيتنام وروسيا وموريشوس"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen gradient-dark">
        <Header />
        <main>
          <AudioList />
        </main>
      </div>
    </SecurityProvider>
  );
};

export default Index;
