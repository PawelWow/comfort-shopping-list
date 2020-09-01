class ShoppingTimeOptions {
   constructor(isShoppingScheduled, shoppingDate, isReminderSet, remindOnTime, reminderHours, reminderMinutes ){

        // Czy zakupy w ogóle są planowane?
        this.isShoppingScheduled = isShoppingScheduled;
        this.shoppingDate = shoppingDate;
        // Czy włączyć reminder
        this.isReminderSet = isReminderSet;
        // Czy wysłać przypomnienie w godzinie zakupów
        this.remindOnTime = remindOnTime;
        // ile czasu przed godziną zakupów wysłać przypomnienie (jest to dodatkowa opcja. 0 w obu polach sprawi, że będzie nie aktynwa)
        this.reminderHours = reminderHours;
        this.reminderMinutes = reminderMinutes;

   }
}

export default ShoppingTimeOptions;
