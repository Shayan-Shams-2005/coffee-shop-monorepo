// app/admin/products/edit/components/DatePickerStyles.tsx

export function DatePickerStyles() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      .rmdp-wrapper { border-radius: 1rem !important; border: 1px solid #F0EBE1 !important; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important; }
      .rmdp-header-values { color: #2C1E16 !important; font-weight: 700 !important; }
      .rmdp-week-day { color: #C68E58 !important; }
      .rmdp-day.rmdp-selected span:not(.highlight) { background-color: #C68E58 !important; color: #fff !important; box-shadow: 0 4px 12px rgba(198, 142, 88, 0.3) !important; }
      .rmdp-day.rmdp-today span { background-color: #FCF9F5 !important; border: 1px solid #C68E58 !important; color: #2C1E16 !important; }
      .rmdp-day:not(.rmdp-disabled):not(.rmdp-day-hidden):hover span { background-color: #FCF9F5 !important; color: #C68E58 !important; }
      .rmdp-arrow-container:hover { background-color: #FCF9F5 !important; box-shadow: none !important; }
      .rmdp-arrow { border-color: #8C7A6B !important; }
      .rmdp-time-picker div input { background-color: #fff !important; color: #2C1E16 !important; border: 1px solid #F0EBE1 !important; border-radius: 0.5rem !important; }
      .rmdp-time-picker .rmdp-arrow { border-color: #C68E58 !important; }

      .dark .rmdp-wrapper { background-color: #231511 !important; border: 1px solid #3c2317 !important; color: #EAE0D5 !important; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important; }
      .dark .rmdp-header-values { color: #EAE0D5 !important; }
      .dark .rmdp-day { color: #EAE0D5 !important; }
      .dark .rmdp-day.rmdp-deactive { color: #5A483F !important; }
      .dark .rmdp-day:not(.rmdp-disabled):not(.rmdp-day-hidden):hover span { background-color: #3c2317 !important; color: #EAE0D5 !important; }
      .dark .rmdp-day.rmdp-selected span:not(.highlight) { background-color: #C68E58 !important; color: #fff !important; box-shadow: 0 4px 12px rgba(198, 142, 88, 0.3) !important; }
      .dark .rmdp-day.rmdp-today span { background-color: #1A0F0C !important; border: 1px solid #C68E58 !important; color: #EAE0D5 !important; }
      .dark .rmdp-arrow { border-color: #EAE0D5 !important; }
      .dark .rmdp-arrow-container:hover { background-color: #3c2317 !important; }
      .dark .rmdp-panel-body li { background-color: #1A0F0C !important; color: #EAE0D5 !important; }
      .dark .rmdp-time-picker div input { background-color: #1A0F0C !important; color: #EAE0D5 !important; border: 1px solid #3c2317 !important; }
    `}} />
  );
}