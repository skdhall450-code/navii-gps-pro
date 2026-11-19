"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Car, Map, Bell, Menu, LogOut, ArrowUpRight } from "lucide-react";
import { CustomerSession, type CustomerIdentity } from "./CustomerSession";
import styles from "./customer.module.css";
type NavigationItem = {
    name: string;
    href: string;
};
const primary = [{ name: "Home", href: "/dashboard", icon: Home }, { name: "Vehicles", href: "/dashboard/vehicles", icon: Car }, { name: "Tracking", href: "/dashboard/live-tracking", icon: Map }, { name: "Alerts", href: "/dashboard/alerts", icon: Bell }];
export default function CustomerShell({ user, navigation, onLogout, children }: {
    user: CustomerIdentity;
    navigation: NavigationItem[];
    onLogout: () => void;
    children: React.ReactNode;
}) {
    const path = usePathname();
    const customerNavigation = [...navigation, { name: "Alert preferences", href: "/dashboard/customer-settings" }];
    return <CustomerSession.Provider value={user}><div className={styles.portal} data-customer-portal>
    <a className={styles.skip} href="#customer-content">Skip to content</a>
    <header className={styles.header}><Link href="/dashboard" aria-label="NAVII GPS home" className={styles.brand}><Image src="/assets/logo/logo.png" width={112} height={54} alt="NAVII GPS" priority/><span>YOUR CONNECTED JOURNEY</span></Link><div className={styles.account}><span>{user.name || "Your account"}</span><button onClick={onLogout} aria-label="Log out"><LogOut size={18}/><span>Log out</span></button></div></header>
    <div className={styles.workspace}><aside className={styles.sidebar}><p className={styles.eyebrow}>MY NAVII</p><nav aria-label="Customer navigation">{customerNavigation.map(item => <Link key={item.href} href={item.href} aria-current={path === item.href ? "page" : undefined}>{item.name}<ArrowUpRight size={15}/></Link>)}</nav><div className={styles.sideNote}>Clarity for every journey.<br /><small>Your vehicles. Your view.</small></div></aside>
    <main id="customer-content" className={styles.content}>{children}</main></div>
    <nav className={styles.dock} aria-label="Quick navigation">{primary.map(({ name, href, icon: Icon }) => <Link key={href} href={href} aria-current={path === href ? "page" : undefined}><Icon size={21}/><span>{name}</span></Link>)}<details className={styles.more}><summary><Menu size={21}/><span>More</span></summary><div className={styles.morePanel}>{customerNavigation.filter(item => !primary.some(p => p.href === item.href)).map(item => <Link key={item.href} href={item.href}>{item.name}</Link>)}</div></details></nav>
  </div></CustomerSession.Provider>;
}
