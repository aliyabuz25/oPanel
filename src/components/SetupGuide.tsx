import { FileJson, Settings, BookOpen } from 'lucide-react';
import { type AdminLanguage, getLocalizedText } from '../utils/adminLanguage';
import './SetupGuide.css';

interface SetupGuideProps {
    language: AdminLanguage;
}

const SetupGuide: React.FC<SetupGuideProps> = ({ language }) => {
    const steps = [
        {
            id: 1,
            title: getLocalizedText(language, 'Sitemap Faylını Yaradın', 'Создайте файл Sitemap'),
            description: getLocalizedText(language, 'public/sitemap.json faylında menyu strukturunu saxlayın.', 'Храните структуру меню в файле public/sitemap.json.'),
            path: 'public/sitemap.json',
            icon: FileJson,
        },
        {
            id: 2,
            title: getLocalizedText(language, 'Dokumentasiya Şablonu', 'Шаблон документации'),
            description: getLocalizedText(language, 'Nümunə sənəd səhifəsini redaktə edib komandadaxili təlimat kimi istifadə edin.', 'Редактируйте пример страницы документации для внутренних инструкций команды.'),
            path: 'public/example-index.html',
            icon: BookOpen,
        },
        {
            id: 3,
            title: getLocalizedText(language, 'Sistem Ayarlarını Tənzimləyin', 'Настройте системные параметры'),
            description: getLocalizedText(language, 'Saytın ümumi tənzimləmələrini, loqo və əlaqə məlumatlarını idarə edin.', 'Управляйте общими настройками сайта, логотипом и контактной информацией.'),
            path: getLocalizedText(language, 'Sistem Ayarları', 'Системные настройки'),
            icon: Settings,
        }
    ];

    return (
        <div className="setup-guide">
            <div className="setup-header">
                <div className="setup-brand">
                    <div className="octo-logo">🏎️</div>
                    <h2>{getLocalizedText(language, 'Forsaj Club İdarəetmə', 'Управление Forsaj Club')}</h2>
                </div>
                <h1>{getLocalizedText(language, 'Xoş Gəlmisiniz! Paneli Qurmağa Başlayaq', 'Добро пожаловать! Давайте настроим панель')}</h1>
                <p>{getLocalizedText(language, 'Forsaj Club platformanız üçün admin panel hazırdır. Aşağıdakı addımlarla ilkin konfiqurasiyanı tamamlayın.', 'Админ-панель Forsaj Club готова. Завершите базовую настройку по шагам ниже.')}</p>
            </div>

            <div className="setup-grid">
                <div className="steps-container">
                    {steps.map((step) => (
                        <div key={step.id} className="step-card">
                            <div className="step-icon">
                                <step.icon size={26} />
                            </div>
                            <div className="step-content">
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                                <span className="step-badge">{step.path}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="setup-sidebar-actions">
                    <div className="action-card primary">
                        <Settings size={32} />
                        <h4>{getLocalizedText(language, 'Admin-Only Rejim', 'Режим только админ')}</h4>
                        <p>{getLocalizedText(language, 'Bu qurulum yalnız admin panel üçün optimizasiya olunub.', 'Эта конфигурация оптимизирована только для админ-панели.')}</p>
                    </div>
                </div>
            </div>

            <div className="setup-footer">
                <div className="info-box">
                    <strong>{getLocalizedText(language, 'Məlumat:', 'Информация:')}</strong> {getLocalizedText(language, 'Menyu strukturu və məzmun faylları admin panel üzərindən idarə olunur.', 'Структура меню и контент управляются через админ-панель.')}
                </div>
            </div>
        </div>
    );
};

export default SetupGuide;
