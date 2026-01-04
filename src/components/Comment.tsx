import * as React from 'react';
import Giscus from '@giscus/react';
import { COMMENT_CONFIG } from '../consts';

const id = 'inject-comments';

const Comments = () => {
    const [mounted, setMounted] = React.useState(false);
    const [theme, setTheme] = React.useState('light');

    React.useEffect(() => {
        setMounted(true);
        const getTheme = () => {
            const currentTheme = localStorage.getItem('theme');
            // If localStorage is set, use it. Otherwise fallback to checking the class or system preference
            if (currentTheme) return currentTheme;
            return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        };

        setTheme(getTheme());

        // Watch for class changes on html element to update theme dynamically
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div id={id} className="w-full">
            {mounted ? (
                <Giscus
                    id={id}
                    {...COMMENT_CONFIG}
                    theme={theme}
                />
            ) : null}
        </div>
    );
};

export default Comments;