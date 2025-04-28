import React from 'react';
import Image from 'next/image';
import styles from './whoami.module.css';
import { MagicCard } from '../magicui/magic-card';

export const WhoAmI: React.FC = () => {
  return (
   
    <div className={styles.cardContainer}>
    <MagicCard>
      <div className={styles.idCard}>
        <header className={styles.cardHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.department}>作業WEB DEV</span>
            <span className={styles.officer}>DEVELOPER</span>
            <span className={styles.name}>DAVID LUKAS</span>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.signal}>SIGNAL LOW</div>
            <div className={styles.battery}>▰▰▰▱</div>
          </div>
        </header>

        <div className={styles.cardBody}>
          <div className={styles.photoSection}>
            <div className={styles.avatar}>
              <Image
                src="/terminal-folio/images/avatar.png"
                alt="Avatar"
                width={200}
                height={200}
                className={styles.avatarImage}
              />
            </div>
          </div>
          <div className={styles.infoSection}>
            <div>REPL: HUMAN ☐</div>
            <div className={styles.secCode}>SEC CODE<br/>190-4X8-1183</div>
            <div className={styles.division}>
              ルクスタッフ<br/>
              RETRO FUTURE
              <br/>
              開発者
            </div>
          </div>
        </div>

        <div className={styles.authorization}>
          AUTHORIZATION GRANTED TO ACCESS AND MODIFY ALL SYSTEM PARAMETERS, DEPLOYMENT CONFIGURATIONS, AND DATABASE STRUCTURES WITHIN SPECIFIED SECURITY CLEARANCE LEVEL
          AUTHORIZATION GRANTED TO ACCESS AND MODIFY ALL SYSTEM PARAMETERS, DEPLOYMENT CONFIGURATIONS, AND DATABASE STRUCTURES WITHIN SPECIFIED SECURITY CLEARANCE LEVEL
          AUTHORIZATION GRANTED TO ACCESS AND MODIFY ALL SYSTEM PARAMETERS, DEPLOYMENT CONFIGURATIONS, AND DATABASE STRUCTURES WITHIN SPECIFIED SECURITY CLEARANCE LEVEL
          AUTHORIZATION GRANTED TO ACCESS AND MODIFY ALL SYSTEM PARAMETERS, DEPLOYMENT CONFIGURATIONS, AND DATABASE STRUCTURES WITHIN SPECIFIED SECURITY CLEARANCE LEVEL
          AUTHORIZATION GRANTED TO ACCESS AND MODIFY ALL SYSTEM PARAMETERS, DEPLOYMENT CONFIGURATIONS, AND DATABASE STRUCTURES WITHIN SPECIFIED SECURITY CLEARANCE LEVEL
          AUTHORIZATION GRANTED TO ACCESS AND MODIFY ALL SYSTEM PARAMETERS, DEPLOYMENT CONFIGURATIONS, AND DATABASE STRUCTURES WITHIN SPECIFIED SECURITY CLEARANCE LEVEL
          AUTHORIZATION GRANTED TO ACCESS AND MODIFY ALL SYSTEM PARAMETERS, DEPLOYMENT CONFIGURATIONS, AND DATABASE STRUCTURES WITHIN SPECIFIED SECURITY CLEARANCE LEVEL
        </div>

        <footer className={styles.cardFooter}>
          PROPERTY OF WEB DEVELOPMENT DIVISION/PRAGUE UNIT
        </footer>
      </div>
      </MagicCard>
    </div>
  );
};
