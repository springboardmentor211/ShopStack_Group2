package com.shopstack;

import com.shopstack.customer.dto.CustomerResponseDTO;
import com.shopstack.customer.service.CustomerService;
import com.shopstack.product.dto.ProductResponse;
import com.shopstack.product.service.ProductService;
import com.shopstack.security.jwt.JwtUtils;
import com.shopstack.security.service.CustomUserDetailsService;
import com.shopstack.wishlist.dto.WishlistRequest;
import com.shopstack.wishlist.dto.WishlistResponse;
import com.shopstack.wishlist.service.WishlistService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@SpringBootTest
class ShopstackApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private JwtUtils jwtUtils;

	@MockitoBean
	private CustomUserDetailsService userDetailsService;

	@MockitoBean
	private CustomerService customerService;

	@MockitoBean
	private WishlistService wishlistService;

	@MockitoBean
	private ProductService productService;

	@Test
	void contextLoads() {
	}

	@Test
	void customerProfileWithoutTokenExplainsHowToAuthenticate() throws Exception {
		mockMvc.perform(get("/api/v1/customers/1"))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.message").value(
						"Authentication is required. Sign in or register at /api/v1/auth, then send the returned JWT in the Authorization header."));
	}

	@Test
	void customerProfileAcceptsLoginJwt() throws Exception {
		String email = "customer@example.com";
		when(userDetailsService.loadUserByUsername(email)).thenReturn(
				User.withUsername(email).password("encoded-password").authorities("ROLE_CUSTOMER").build());
		when(customerService.getCustomerProfile(1L)).thenReturn(
				CustomerResponseDTO.builder().id(1L).email(email).build());
		String token = jwtUtils.generateJwtToken(email);

		mockMvc.perform(get("/api/v1/customers/1")
				.header("Authorization", String.join(" ", "Bearer", token)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.email").value(email));
	}

	@Test
	void addingWishlistItemDoesNotRequireAuthentication() throws Exception {
		when(wishlistService.addToWishlist(any(WishlistRequest.class))).thenReturn(
				WishlistResponse.builder().customerId(4L).productId(1L).build());

		mockMvc.perform(post("/api/v1/customers/4/wishlist/items")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"customerId\":4,\"productId\":1}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.customerId").value(4))
				.andExpect(jsonPath("$.productId").value(1));
	}

	@ParameterizedTest
	@CsvSource({
			"GET, /api/v1/customers/4/wishlist",
			"DELETE, /api/v1/customers/4/wishlist/products/1",
			"DELETE, /api/v1/customers/4/wishlist/items/1"
	})
	void wishlistReadAndDeleteDoNotRequireAuthentication(String method, String path) throws Exception {
		mockMvc.perform(request(HttpMethod.valueOf(method), path))
				.andExpect(status().is2xxSuccessful());
	}

	@ParameterizedTest
	@CsvSource({
			"GET, /api/v1/products",
			"GET, /api/v1/products/1",
			"GET, /api/v1/products/category/books"
	})
	void productCatalogReadsDoNotRequireAuthentication(String method, String path) throws Exception {
		when(productService.getAllActiveProducts()).thenReturn(List.of());
		when(productService.getProductById(1L)).thenReturn(ProductResponse.builder().id(1L).build());
		when(productService.getProductsByCategory("books")).thenReturn(List.of());

		mockMvc.perform(request(HttpMethod.valueOf(method), path))
				.andExpect(status().is2xxSuccessful());
	}

	@Test
	void errorEndpointDoesNotRequireAuthentication() throws Exception {
		mockMvc.perform(get("/error"))
				.andExpect(result -> assertNotEquals(401, result.getResponse().getStatus()));
	}

	@ParameterizedTest
	@CsvSource({
			"GET, /api/v1/customers/1",
			"PUT, /api/v1/customers/1",
			"POST, /api/v1/customers/1/addresses",
			"GET, /api/v1/customers/1/addresses",
			"DELETE, /api/v1/customers/addresses/1",
			"GET, /api/v1/customers/1/cart",
			"POST, /api/v1/customers/1/cart/items",
			"PUT, /api/v1/customers/1/cart/items/1",
			"DELETE, /api/v1/customers/1/cart/items/1",
			"POST, /api/v1/products",
			"PUT, /api/v1/products/1",
			"DELETE, /api/v1/products/1",
			"POST, /api/v1/coupons/apply",
			"POST, /api/v1/reviews",
			"GET, /api/v1/reviews/products/1",
			"POST, /api/v1/customers/1/orders",
			"GET, /api/v1/orders/1",
			"GET, /api/v1/customers/1/orders",
			"POST, /api/v1/payments",
			"POST, /api/v1/payments/1/process",
			"GET, /api/v1/payments/orders/1",
			"POST, /api/v1/shipments",
			"PUT, /api/v1/shipments/1/deliver",
			"GET, /api/v1/shipments/orders/1",
	})
	void apiEndpointsRequireAuthentication(String method, String path) throws Exception {
		mockMvc.perform(request(HttpMethod.valueOf(method), path))
				.andExpect(status().isUnauthorized());
	}
}
