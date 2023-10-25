
using System.Security.Cryptography;
using System.Text;

namespace WatchlistWeb.Helper
{
    public class HashClass
    {
        static public string GetHash(string data)
        {
            SHA256 mySHA256 = SHA256.Create();
            byte[] dataByte = Encoding.ASCII.GetBytes(data);
            byte[] hashValue = mySHA256.ComputeHash(dataByte);
            return Encoding.ASCII.GetString(hashValue);
        }
    }
}
