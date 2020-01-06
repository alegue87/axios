//+------------------------------------------------------------------+
//|                                                     snapshot.mq4 |
//|                        Copyright 2020, MetaQuotes Software Corp. |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2020, MetaQuotes Software Corp."
#property link      "https://www.mql5.com"
#property version   "1.00"
#property strict

string USERNAME = "test";
const string DATA_PATH = TerminalInfoString(TERMINAL_DATA_PATH);

//+------------------------------------------------------------------+
//| Script program start function                                    |
//+------------------------------------------------------------------+
void OnStart()
{
   write_data_file();
}
//+------------------------------------------------------------------+

int write_data_file()
{
   int res; // File resource
   
   const string filename = "screenshot.dat";
   res = FileOpen(filename, FILE_WRITE | FILE_CSV);
   if(res != INVALID_HANDLE){
      Print("File " + filename + " aperto correttamente");
      FileWrite(res, "username#"+USERNAME);
      FileWrite(res, "time#"+TimeToString(TimeLocal(), TIME_DATE | TIME_SECONDS));
      FileWrite(res, "filename#"+take_screenshot());
      FileWrite(res, "account_balance#"+AccountBalance());
      FileWrite(res, "account_equity#"+AccountEquity());
      FileWrite(res, "account_leverage#"+AccountLeverage());
      FileWrite(res, "account_margin#"+AccountMargin());
      FileWrite(res, "account_free_margin#"+AccountFreeMargin());
      FileWrite(res, "account_profit#"+AccountProfit());
      save_positions(res);
   }
   else{
      Print("Errore nell'apertura del file dati: " + filename);
      Print("Error code ",GetLastError());
   }
   return true;
}
//+------------------------------------------------------------------+
void save_positions(int res)
{
   int orders_total = OrdersTotal();
   Print("Totale ordini: " + OrdersTotal());
   for(int i = 0; i < orders_total ; i++)
   {
      if(OrderSelect(i, SELECT_BY_POS) == false) continue;
      string order_type;
      if(OrderType() == OP_BUY)
         order_type = "buy";
      else if(OrderType() == OP_SELL)
         order_type = "sell";
      else 
         order_type = "other";
      FileWrite(res,"position#"+ 
         OrderTicket()+"_"+OrderOpenTime()+"_"+order_type+"_"+OrderLots()+"_"+OrderProfit());
   }
}
//+------------------------------------------------------------------+
string take_screenshot(){
   datetime cur = TimeCurrent();
   string name =
      TimeYear(cur) + "_" + TimeMonth(cur) + "_" + TimeDay(cur) +
      "_" + TimeHour(cur) + "_" + TimeMinute(cur) + "_" + TimeSeconds(cur) + ".png";
   if (ChartScreenShot(0, name, 1366, 768, ALIGN_LEFT))
      Alert("We've saved the screenshot ", name);
   return name;
}