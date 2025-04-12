package dev.nefor.webhooker.util;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.util.Map;

/**
 * Класс для выполнения HTTP-запросов к API
 */
public class ApiClient {
    private final String baseUrl;
    private final ApiAuth apiAuth;
    private final HttpClient httpClient;
    
    /**
     * Создает новый экземпляр ApiClient
     * @param baseUrl базовый URL API
     * @param apiAuth объект аутентификации
     */
    public ApiClient(String baseUrl, ApiAuth apiAuth) {
        this.baseUrl = baseUrl;
        this.apiAuth = apiAuth;
        this.httpClient = HttpClients.createDefault();
    }
    
    /**
     * Отправляет POST запрос с параметрами
     * @param endpoint эндпоинт API
     * @param params параметры запроса
     * @return ответ сервера в формате JSON
     * @throws IOException если произошла ошибка при выполнении запроса
     */
    public String sendPostRequest(String endpoint, Map<String, String> params) throws IOException {
        String url = baseUrl + endpoint;
        String queryString = apiAuth.createRequestUrl("", params).substring(1); // Убираем начальный "?"
        Map<String, String> headers = apiAuth.createAuthHeaders(queryString);
        
        HttpPost httpPost = new HttpPost(url + "?" + queryString);
        
        // Добавляем заголовки аутентификации
        for (Map.Entry<String, String> header : headers.entrySet()) {
            httpPost.addHeader(header.getKey(), header.getValue());
        }
        
        HttpResponse response = httpClient.execute(httpPost);
        return EntityUtils.toString(response.getEntity());
    }
    
    /**
     * Отправляет POST запрос с JSON телом
     * @param endpoint эндпоинт API
     * @param jsonBody тело запроса в формате JSON
     * @return ответ сервера в формате JSON
     * @throws IOException если произошла ошибка при выполнении запроса
     */
    public String sendPostRequest(String endpoint, String jsonBody) throws IOException {
        String url = baseUrl + endpoint;
        Map<String, String> headers = apiAuth.createAuthHeaders(jsonBody);
        
        HttpPost httpPost = new HttpPost(url);
        
        // Добавляем заголовки аутентификации
        for (Map.Entry<String, String> header : headers.entrySet()) {
            httpPost.addHeader(header.getKey(), header.getValue());
        }
        
        // Добавляем заголовок Content-Type
        httpPost.addHeader("Content-Type", "application/json");
        
        // Устанавливаем тело запроса
        StringEntity entity = new StringEntity(jsonBody, ContentType.APPLICATION_JSON);
        httpPost.setEntity(entity);
        
        HttpResponse response = httpClient.execute(httpPost);
        return EntityUtils.toString(response.getEntity());
    }
    
    /**
     * Отправляет GET запрос
     * @param endpoint эндпоинт API
     * @param params параметры запроса
     * @return ответ сервера в формате JSON
     * @throws IOException если произошла ошибка при выполнении запроса
     */
    public String sendGetRequest(String endpoint, Map<String, String> params) throws IOException {
        String queryString = apiAuth.createRequestUrl("", params).substring(1); // Убираем начальный "?"
        String url = baseUrl + endpoint + "?" + queryString;
        Map<String, String> headers = apiAuth.createAuthHeaders(queryString);
        
        HttpGet httpGet = new HttpGet(url);
        
        // Добавляем заголовки аутентификации
        for (Map.Entry<String, String> header : headers.entrySet()) {
            httpGet.addHeader(header.getKey(), header.getValue());
        }
        
        // Логируем запрос
        System.out.println("Отправка GET запроса: " + url);
        System.out.println("Заголовки запроса:");
        for (Map.Entry<String, String> header : headers.entrySet()) {
            System.out.println("  " + header.getKey() + ": " + header.getValue());
        }
        
        HttpResponse response = httpClient.execute(httpGet);
        String responseBody = EntityUtils.toString(response.getEntity());
        
        // Логируем ответ
        System.out.println("Код ответа: " + response.getStatusLine().getStatusCode());
        System.out.println("Тело ответа: " + responseBody);
        
        return responseBody;
    }
} 