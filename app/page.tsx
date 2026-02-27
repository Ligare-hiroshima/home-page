import styles from "./page.module.css";
import sectionStyles from "../components/Section.module.css";

const newsItems = [
  { date: "2026.02.10", title: "コーポレートサイトをリニューアルしました。" },
  { date: "2026.01.26", title: "新サービスの提供を開始しました。" },
  { date: "2025.12.18", title: "年末年始休業のお知らせ" }
];

const services = [
  {
    name: "Web制作",
    description: "企業価値が伝わるサイト設計から実装まで一気通貫で対応します。"
  },
  {
    name: "運用支援",
    description: "更新体制の整備と継続的な改善で、成果につながる運用を伴走します。"
  },
  {
    name: "ブランディング",
    description: "コンセプト設計とデザイン開発で、らしさを視覚化します。"
  }
];

const works = [
  "住宅関連企業コーポレートサイト",
  "地域密着型サービスLP",
  "採用強化向けオウンドメディア"
];

export default function Home() {
  return (
    <main className={styles.main}>
      <section id="hero" className={styles.hero}>
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.logoLayer}>
          <div className={styles.logoMark}>L</div>
          <p className={styles.logoText}>Ligare Inc.</p>
        </div>
        <div className={styles.heroContent}>
          <p className={styles.heroLead}>価値を伝える、未来をつくる。</p>
          <h1 className={styles.heroTitle}>LIGARE CORPORATE SITE</h1>
          <p className={styles.heroDescription}>
            デザインとテクノロジーで、企業とユーザーをつなぐ体験を提供します。
          </p>
        </div>
      </section>

      <section id="news" className={sectionStyles.section}>
        <div className={sectionStyles.container}>
          <h2 className={sectionStyles.title}>News</h2>
          <ul className={styles.newsList}>
            {newsItems.map((item) => (
              <li key={`${item.date}-${item.title}`} className={styles.newsItem}>
                <span>{item.date}</span>
                <p>{item.title}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="about" className={sectionStyles.sectionAlt}>
        <div className={sectionStyles.container}>
          <h2 className={sectionStyles.title}>About</h2>
          <p className={sectionStyles.text}>
            私たちは、企業の想いを正しく届けるためのデジタルコミュニケーションを設計するチームです。課題発見から制作、運用までを一貫して支援します。
          </p>
        </div>
      </section>

      <section id="service" className={sectionStyles.section}>
        <div className={sectionStyles.container}>
          <h2 className={sectionStyles.title}>Service</h2>
          <div className={styles.cardGrid}>
            {services.map((service) => (
              <article key={service.name} className={styles.card}>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="works" className={sectionStyles.sectionAlt}>
        <div className={sectionStyles.container}>
          <h2 className={sectionStyles.title}>Works</h2>
          <ul className={styles.workList}>
            {works.map((work) => (
              <li key={work}>{work}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contact" className={sectionStyles.section}>
        <div className={sectionStyles.container}>
          <h2 className={sectionStyles.title}>Contact</h2>
          <p className={sectionStyles.text}>
            ご相談・お見積りは下記メールまでお気軽にご連絡ください。
          </p>
          <a className={styles.contactLink} href="mailto:info@example.com">
            info@example.com
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <small>© 2026 Ligare Inc. All rights reserved.</small>
      </footer>
    </main>
  );
}
